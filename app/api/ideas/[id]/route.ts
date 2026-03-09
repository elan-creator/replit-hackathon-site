import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyDeletePassword } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ideaId = parseInt(id, 10);
    if (isNaN(ideaId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    if (!verifyDeletePassword(body.password)) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const result = await pool.query('DELETE FROM ideas WHERE id = $1 RETURNING id', [ideaId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: '아이디어를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete idea:', error);
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
