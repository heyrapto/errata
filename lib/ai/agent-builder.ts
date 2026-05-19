import { TutorMode } from '@/types/lesson';
import { extractTextFromPdf } from '@/lib/document-processing/extract-text';
import { chunkText } from '@/lib/document-processing/chunk-text';
import { getEmbedding } from '@/lib/ai/embeddings';
import { indexDocumentChunks } from '@/lib/search/index-document';
import { hybridSearch } from '@/lib/search/hybrid-search';
import { getGeminiModel } from '@/lib/ai/gemini';
import { buildLessonPrompt } from '@/lib/ai/prompts';
import { createLesson } from '@/lib/db/lessons';
import { createNote } from '@/lib/db/notes';
import { createQuiz } from '@/lib/db/quizzes';
import { createProgressRecord } from '@/lib/db/progress';
import { createSchedule } from '@/lib/db/schedules';

/**
 * Agent Flow 1: Upload Study Material Flow
 * Extracts text, chunks it, generates vector embeddings, and indexes chunks in Elasticsearch.
 */
export async function runUploadFlow(
  userId: string,
  documentId: string,
  pdfBuffer: Buffer,
  title: string,
  subject?: string
): Promise<{ success: boolean; chunkCount: number; error?: string }> {
  try {
    // 1. Extract text
    const text = await extractTextFromPdf(pdfBuffer);
    
    // 2. Chunk text
    const chunks = chunkText(text);
    
    // 3. Embed & Index
    await indexDocumentChunks(userId, documentId, title, chunks, subject);
    
    return {
      success: true,
      chunkCount: chunks.length,
    };
  } catch (error: any) {
    console.error('Error running Upload Flow:', error);
    return {
      success: false,
      chunkCount: 0,
      error: error.message || 'Unknown upload flow error',
    };
  }
}

/**
 * Agent Flow 2: Lesson Generation Flow
 * Performs Elasticsearch context retrieval, triggers Gemini Structured Lesson Gen, and persists notes.
 */
export async function runLessonFlow(
  userId: string,
  topic: string,
  mode: TutorMode,
  documentId?: string
) {
  try {
    let contextChunks: string[] = [];
    
    // 1. Retrieve context if document is present
    if (documentId) {
      const searchResults = await hybridSearch(userId, topic, documentId);
      contextChunks = searchResults.map(r => r.text);
    }
    
    // 2. Build prompt and invoke Gemini 1.5 Flash
    const prompt = buildLessonPrompt(topic, mode, contextChunks);
    const model = getGeminiModel('gemini-1.5-flash');
    
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Parse response JSON
    let lessonContent;
    try {
      // Basic sanitize for JSON parsing
      const jsonStart = textResponse.indexOf('{');
      const jsonEnd = textResponse.lastIndexOf('}') + 1;
      const cleanJson = textResponse.substring(jsonStart, jsonEnd);
      lessonContent = JSON.parse(cleanJson);
    } catch {
      // Fallback fallback lesson
      lessonContent = {
        title: topic,
        sections: [{ title: 'Overview', body: textResponse }],
        examples: [],
        keyPoints: [topic]
      };
    }
    
    // 3. Persist lesson to DB
    const lesson = await createLesson({
      user_id: userId,
      document_id: documentId,
      topic,
      mode,
      content: lessonContent,
    });
    
    if (!lesson) throw new Error('Failed to persist lesson');
    
    // 4. Auto-generate study notes from keyPoints
    const note = await createNote({
      user_id: userId,
      lesson_id: lesson.id,
      content: {
        title: `Revision Notes: ${lessonContent.title}`,
        summary: `Key takeaways from the lesson on ${topic} (${mode} mode).`,
        bullets: lessonContent.keyPoints || [],
        formulasOrDefinitions: lessonContent.sections.slice(0, 2).map((s: any) => `${s.title}: ${s.body.substring(0, 80)}...`),
      }
    });
    
    return {
      success: true,
      lesson,
      note,
    };
  } catch (error: any) {
    console.error('Error running Lesson Flow:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Agent Flow 3: Quiz Flow
 * Generates interactive test questions based on completed lessons.
 */
export async function runQuizFlow(
  userId: string,
  lessonId: string,
  topic: string,
  lessonText: string
) {
  try {
    const model = getGeminiModel('gemini-1.5-flash');
    const prompt = `
You are EduAgent Quiz Master. Generate a multiple-choice or short-answer quiz based on the following lesson material on: "${topic}".
Generate exactly 4 interactive questions.

Lesson content:
${lessonText}

You MUST return your response as a valid JSON object matching the following array format:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "What is ...?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Brief explanation of why A is correct"
    },
    {
      "id": "q2",
      "type": "short-answer",
      "question": "Define ...?",
      "correctAnswer": "Exact definition key terms",
      "explanation": "Brief explanation"
    }
  ]
}
`;
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    const { questions } = JSON.parse(textResponse.substring(jsonStart, jsonEnd));
    
    const quiz = await createQuiz({
      user_id: userId,
      lesson_id: lessonId,
      questions,
    });
    
    return {
      success: true,
      quiz,
    };
  } catch (error: any) {
    console.error('Error running Quiz Flow:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Agent Flow 4: Schedule Flow
 * Sets up a user study session and registers active study pathways.
 */
export async function runScheduleFlow(
  userId: string,
  subject: string,
  dayOfWeek: number,
  startTime: string,
  durationMins: number
) {
  try {
    const schedule = await createSchedule({
      user_id: userId,
      subject,
      day_of_week: dayOfWeek,
      start_time: startTime,
      duration_mins: durationMins,
      active: true,
    });
    
    return {
      success: true,
      schedule,
    };
  } catch (error: any) {
    console.error('Error running Schedule Flow:', error);
    return { success: false, error: error.message };
  }
}
