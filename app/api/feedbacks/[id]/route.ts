import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyDeletePassword } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    if (!verifyDeletePassword(body.password)) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const result = await pool.query('DELETE FROM feedbacks WHERE id = $1 RETURNING id', [feedbackId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: '피드백을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
