import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getDocumentsByUserId, deleteDocument } from '@/lib/db/documents';
import { deleteDocumentFromIndex } from '@/lib/search/index-document';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const documents = await getDocumentsByUserId(userId);

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error: any) {
    console.error('Error fetching documents list:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing document ID.' }, { status: 400 });
    }

    // 1. Delete from Supabase PostgreSQL (RLS / cascades take care of security or admin key override)
    const success = await deleteDocument(id);
    if (!success) {
      throw new Error('Failed to delete document from PostgreSQL database.');
    }

    // 2. Clean up kNN Vector elements inside Elasticsearch index
    await deleteDocumentFromIndex(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during deletion.' },
      { status: 500 }
    );
  }
}
