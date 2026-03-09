import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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
      'SELECT * FROM feedbacks WHERE service_id = $1 ORDER BY created_at DESC',
      [serviceId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const serviceCheck = await pool.query('SELECT id, url, title FROM services WHERE id = $1', [serviceId]);
    if (serviceCheck.rows.length === 0) {
      return NextResponse.json({ error: '서비스를 찾을 수 없습니다.' }, { status: 404 });
    }
    const service = serviceCheck.rows[0];

    const body = await req.json();
    const { author_name, feedback_text, image_data } = body;

    const finalAuthorName = (author_name && typeof author_name === 'string' && author_name.trim().length > 0)
      ? author_name.trim().slice(0, 100)
      : '익명';
    if (!feedback_text || typeof feedback_text !== 'string' || feedback_text.trim().length === 0 || feedback_text.length > 5000) {
      return NextResponse.json({ error: '피드백을 입력해주세요. (최대 5000자)' }, { status: 400 });
    }
    if (image_data && typeof image_data === 'string' && image_data.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '이미지가 너무 큽니다. (최대 5MB)' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO feedbacks (service_id, service_url, service_title, author_name, feedback_text, image_data)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        serviceId,
        service.url,
        service.title,
        finalAuthorName,
        feedback_text.trim(),
        image_data || null,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create feedback:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}
