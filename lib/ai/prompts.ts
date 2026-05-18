import { TutorMode } from '@/types/lesson';

export const SYSTEM_PERSONA = `You are EduAgent, a patient, expert AI tutor designed to teach students adaptive, high-impact lessons from academic materials or general academic topics. Your teaching method is interactive, structured, and extremely clear.`;

export const MODE_INSTRUCTIONS: Record<TutorMode, string> = {
  beginner: `
- Explain topics using very simple language and high-level, relatable analogies.
- Assume ZERO prior knowledge. Define all technical terminology carefully.
- Provide simple examples before introducing abstract equations or concepts.
- Focus on building foundational conceptual intuition.
`,
  deep: `
- Provide comprehensive, rigorous coverage of all aspects of the topic.
- Break concepts down into detailed sub-topics and trace cross-references.
- Include deep academic context, mathematical derivations, or historical backgrounds where applicable.
- Emphasise first-principles understanding.
`,
  exam: `
- Focus strictly on WAEC, JAMB, AP, SAT, or university exam standards.
- Provide rigorous exam-style practice questions with detailed mark schemes and scoring guides.
- Emphasise high-scoring phrases, key terms, common trap answers, and time-management tips.
- Be precise and structured.
`,
  revision: `
- Condense the material into a fast, highly-scannable study guide.
- Provide key definitions, bullet points, core formulas, and summary charts.
- Focus on high-yield flashcard-style takeaways.
`
};

export const JSON_SCHEMA_INSTRUCTION = `
You MUST output your response as a valid, parsable JSON object matching the following structure. Do NOT include any markdown block markers like \`\`\`json. Return only raw JSON:

{
  "title": "A highly descriptive title of the lesson/topic",
  "sections": [
    {
      "title": "Section Title",
      "body": "Detailed educational content, formatted nicely with markdown bullet points or paragraphs if necessary"
    }
  ],
  "examples": [
    {
      "concept": "Concept name",
      "scenario": "A concrete, relatable, or exam-style scenario",
      "explanation": "Step-by-step breakdown explaining why and how it works"
    }
  ],
  "keyPoints": [
    "A concise, high-yield bullet point summarizing key lesson learnings (suitable for quick-saved notes)"
  ]
}
`;

export function buildLessonPrompt(topic: string, mode: TutorMode, contextChunks?: string[]): string {
  const contextText = contextChunks && contextChunks.length > 0 
    ? `\n### Document Context (Retrieved Academic Materials):\n${contextChunks.join('\n\n')}\n`
    : `\n### General Knowledge Topic Mode (No Upload):\nNo documents were uploaded. Rely on your general knowledge to generate a high-quality lesson.\n`;

  return `${SYSTEM_PERSONA}

### Target Mode: ${mode.toUpperCase()} MODE
${MODE_INSTRUCTIONS[mode]}

### Topic / Focus Area:
"${topic}"

${contextText}

${JSON_SCHEMA_INSTRUCTION}
`;
}
