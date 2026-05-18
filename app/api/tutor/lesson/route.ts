import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { runLessonFlow } from '@/lib/ai/agent-builder';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'; // frictionless local testing fallback

    const body = await req.json();
    const { topic, mode, documentId } = body;

    if (!topic || !mode) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (topic, mode).' },
        { status: 400 }
      );
    }

    // Trigger AI Agent Builder Lesson Flow
    const flowResult = await runLessonFlow(userId, topic, mode, documentId);

    if (!flowResult.success) {
      return NextResponse.json(
        { success: false, error: flowResult.error || 'Failed to complete lesson orchestration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lesson: flowResult.lesson,
      note: flowResult.note,
    });
  } catch (error: any) {
    console.error('Error in lesson generator route handler:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during lesson flow.' },
      { status: 500 }
    );
  }
}
