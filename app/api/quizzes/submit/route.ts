import { NextRequest, NextResponse } from 'next/server';
import { getQuizById, updateQuizScore } from '@/lib/db/quizzes';
import { createProgressRecord } from '@/lib/db/progress';
import { getGeminiModel } from '@/lib/ai/gemini';
import { QuizGradingResult, QuizFeedback } from '@/types/quiz';

export async function POST(req: NextRequest) {
  try {
    const { quizId, answers } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (quizId, answers).' },
        { status: 400 }
      );
    }

    // 1. Fetch original quiz questions
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found.' }, { status: 404 });
    }

    const questions = quiz.questions;
    let correctCount = 0;
    const feedback: Record<string, QuizFeedback> = {};
    const weakAreas: string[] = [];

    // 2. Grade each question
    for (const q of questions) {
      const userAnswer = (answers[q.id] || '').trim();
      const isMcq = q.type === 'mcq';
      let isCorrect = false;

      if (isMcq) {
        // Direct string match for MCQs
        isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
        if (isCorrect) correctCount++;
        else if (quiz.lesson_id) weakAreas.push(q.question); // flag question focus as weakness

        feedback[q.id] = {
          isCorrect,
          correctAnswer: q.correctAnswer,
          userAnswer,
          explanation: q.explanation || `The correct option is: ${q.correctAnswer}`,
        };
      } else {
        // AI-Assisted grading for short-answers
        try {
          const model = getGeminiModel('gemini-1.5-flash');
          const prompt = `
You are an expert academic grader. Grade this student's short answer response against the target correct answer.
Be lenient with minor phrasing variations, but ensure the core conceptual keyword criteria is met.

Question: "${q.question}"
Correct Answer Criteria: "${q.correctAnswer}"
Student's Answer: "${userAnswer}"

You MUST output exactly a single, valid JSON object matching the following structure:
{
  "isCorrect": true,
  "score": 100,
  "explanation": "Detailed explanation of why the answer is correct or what was missing."
}
`;
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const cleanJson = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
          const graded = JSON.parse(cleanJson);

          isCorrect = graded.isCorrect;
          if (isCorrect) correctCount++;
          else weakAreas.push(q.question);

          feedback[q.id] = {
            isCorrect,
            correctAnswer: q.correctAnswer,
            userAnswer,
            explanation: graded.explanation || q.explanation,
          };
        } catch {
          // Fallback grade
          isCorrect = userAnswer.toLowerCase().includes(q.correctAnswer.toLowerCase());
          if (isCorrect) correctCount++;
          feedback[q.id] = {
            isCorrect,
            correctAnswer: q.correctAnswer,
            userAnswer,
            explanation: q.explanation,
          };
        }
      }
    }

    // 3. Compute final score
    const finalScore = Math.round((correctCount / questions.length) * 100);

    // 4. Update score in quiz record
    await updateQuizScore(quizId, finalScore);

    // 5. Append student progress record
    // Topic name is fetched or mock-resolved from progress parameters
    await createProgressRecord({
      user_id: quiz.user_id,
      topic: `Quiz for Lesson #${quiz.lesson_id?.substring(0, 8)}`,
      score: finalScore,
      weak_areas: finalScore < 70 ? weakAreas.slice(0, 3) : [],
    });

    const resultPayload: QuizGradingResult = {
      score: finalScore,
      feedback,
    };

    return NextResponse.json({
      success: true,
      result: resultPayload,
    });
  } catch (error: any) {
    console.error('Error submitting quiz answers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during grading.' },
      { status: 500 }
    );
  }
}
