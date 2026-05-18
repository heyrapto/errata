import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { runQuizFlow } from '@/lib/ai/agent-builder';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const { lessonId, topic, lessonText } = await req.json();

    if (!lessonId || !topic || !lessonText) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (lessonId, topic, lessonText).' },
        { status: 400 }
      );
    }

    // Trigger AI Agent Builder Quiz Flow
    const flowResult = await runQuizFlow(userId, lessonId, topic, lessonText);

    if (!flowResult.success) {
      return NextResponse.json(
        { success: false, error: flowResult.error || 'Failed to generate quiz questions.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: flowResult.quiz,
    });
  } catch (error: any) {
    console.error('Error in quiz generation route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during quiz flow.' },
      { status: 500 }
    );
  }
}
