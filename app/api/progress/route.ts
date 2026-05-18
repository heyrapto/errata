import { NextRequest, NextResponse } from 'next/server';
import { getProgressByUserId, getWeakAreasByUserId } from '@/lib/db/progress';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter.' },
        { status: 400 }
      );
    }

    const records = await getProgressByUserId(userId);
    const weakAreas = await getWeakAreasByUserId(userId);

    return NextResponse.json({
      success: true,
      records,
      weakAreas,
    });
  } catch (error: any) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}
