import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getGeminiModel } from '@/lib/ai/gemini';
import { MODE_INSTRUCTIONS, SYSTEM_PERSONA } from '@/lib/ai/prompts';
import { hybridSearch } from '@/lib/search/hybrid-search';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const { message, mode, documentId, history } = await req.json();

    if (!message || !mode) {
      return NextResponse.json({ error: 'Missing message or mode parameters.' }, { status: 400 });
    }

    // 1. Fetch relevant vector/semantic context if document is selected
    let contextText = '';
    if (documentId) {
      const searchHits = await hybridSearch(userId, message, documentId, 3);
      if (searchHits.length > 0) {
        contextText = `\n### Retreived Document Context:\n${searchHits.map(h => h.text).join('\n\n')}\n`;
      }
    }

    // 2. Format chat history for Gemini multi-turn format
    const contents: any[] = [];
    
    // Add system-level context in first turn or as system instruction
    const systemPrompt = `${SYSTEM_PERSONA}

### Target Mode: ${mode.toUpperCase()} MODE
${MODE_INSTRUCTIONS[mode as keyof typeof MODE_INSTRUCTIONS]}
${contextText ? `\nUse this document context to answer the student's question accurately:\n${contextText}` : ''}
`;

    // Map historical items to Gemini SDK schema ({ role: 'user' | 'model', parts: [{ text }] })
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      });
    }

    // Push latest message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 3. Initialize Gemini stream
    const model = getGeminiModel('gemini-1.5-flash');
    const resultStream = await model.generateContentStream({
      contents,
      systemInstruction: systemPrompt,
    });

    // 4. Return text response stream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of resultStream.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in chat stream route handler:', error);
    return NextResponse.json({ error: error.message || 'Stream error occurred.' }, { status: 500 });
  }
}
