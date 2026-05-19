import { NextRequest, NextResponse } from 'next/server';
import { createDocument } from '@/lib/db/documents';
import { runUploadFlow } from '@/lib/ai/agent-builder';



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const title = formData.get('title') as string | null;
    const subject = formData.get('subject') as string | null;

    if (!file || !userId || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required upload parameters (file, userId, title).' },
        { status: 400 }
      );
    }

    // 1. Convert File upload to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Persist the raw document record in Supabase (indexed defaults to false)
    const docRecord = await createDocument({
      user_id: userId,
      title,
      subject: subject || undefined,
      storage_path: `https://mockup-supabase-storage.eduagent.ai/${userId}/${crypto.randomUUID()}_${title}`,
    });

    if (!docRecord) {
      throw new Error('Failed to save document metadata in Supabase PostgreSQL.');
    }

    // 3. Trigger asynchronous parsing, embedding, and indexing in background
    // Using runUploadFlow from the AI Agent orchestrator
    const uploadFlowResult = await runUploadFlow(
      userId,
      docRecord.id,
      buffer,
      title,
      subject || undefined
    );

    if (!uploadFlowResult.success) {
      throw new Error(uploadFlowResult.error || 'Failed to complete PDF vector indexing.');
    }

    return NextResponse.json({
      success: true,
      document: docRecord,
      chunksCount: uploadFlowResult.chunkCount,
    });
  } catch (error: any) {
    console.error('Error in upload route handler:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during indexing.' },
      { status: 500 }
    );
  }
}
