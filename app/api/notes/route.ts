import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getNotesByUserId, deleteNote, getNoteById, updateNoteContent } from '@/lib/db/notes';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If fetching individual note
    if (id) {
      const note = await getNoteById(id);
      if (!note) {
        return NextResponse.json({ success: false, error: 'Note not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, note });
    }

    // Else fetch list of notes
    const notes = await getNotesByUserId(userId);
    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ success: false, error: 'Missing note parameters.' }, { status: 400 });
    }

    const note = await updateNoteContent(id, content);
    
    return NextResponse.json({
      success: !!note,
    });
  } catch (error: any) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during save.' },
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
      return NextResponse.json({ success: false, error: 'Missing note ID.' }, { status: 400 });
    }

    const success = await deleteNote(id);
    
    return NextResponse.json({
      success,
    });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}
