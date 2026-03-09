import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyDeletePassword } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT s.*, COUNT(f.id)::int AS feedback_count
       FROM services s
       LEFT JOIN feedbacks f ON f.service_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [serviceId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '서비스를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const body = await req.json();
    if (!verifyDeletePassword(body.password)) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    await pool.query('DELETE FROM feedbacks WHERE service_id = $1', [serviceId]);
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [serviceId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: '서비스를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
