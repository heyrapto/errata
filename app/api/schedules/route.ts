import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getSchedulesByUserId, createSchedule, deleteSchedule } from '@/lib/db/schedules';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const schedules = await getSchedulesByUserId(userId);
    
    return NextResponse.json({
      success: true,
      schedules,
    });
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const { subject, dayOfWeek, startTime, durationMins } = await req.json();

    if (!subject || dayOfWeek === undefined || !startTime || !durationMins) {
      return NextResponse.json(
        { success: false, error: 'Missing required schedule parameters.' },
        { status: 400 }
      );
    }

    const schedule = await createSchedule({
      user_id: userId,
      subject,
      day_of_week: dayOfWeek,
      start_time: startTime,
      duration_mins: durationMins,
      active: true,
    });

    if (!schedule) {
      throw new Error('Failed to save study schedule in PostgreSQL database.');
    }

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error('Error adding study schedule:', error);
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
      return NextResponse.json({ success: false, error: 'Missing schedule slot ID.' }, { status: 400 });
    }

    const success = await deleteSchedule(id);
    
    return NextResponse.json({
      success,
    });
  } catch (error: any) {
    console.error('Error deleting schedule slot:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred during deletion.' },
      { status: 500 }
    );
  }
}
