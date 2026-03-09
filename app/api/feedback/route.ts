import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM feedbacks ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service_url, service_title, author_name, feedback_text, image_data } = body;

    if (!service_url || typeof service_url !== 'string' || service_url.trim().length === 0) {
      return NextResponse.json({ error: '서비스 URL을 입력해주세요.' }, { status: 400 });
    }
    try {
      const parsed = new URL(service_url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'http 또는 https URL만 허용됩니다.' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: '올바른 URL 형식이 아닙니다.' }, { status: 400 });
    }
    if (!author_name || typeof author_name !== 'string' || author_name.trim().length === 0 || author_name.length > 100) {
      return NextResponse.json({ error: '이름을 입력해주세요. (최대 100자)' }, { status: 400 });
    }
    if (!feedback_text || typeof feedback_text !== 'string' || feedback_text.trim().length === 0 || feedback_text.length > 5000) {
      return NextResponse.json({ error: '피드백을 입력해주세요. (최대 5000자)' }, { status: 400 });
    }

    if (image_data && typeof image_data === 'string' && image_data.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '이미지가 너무 큽니다. (최대 5MB)' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO feedbacks (service_url, service_title, author_name, feedback_text, image_data)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        service_url.trim(),
        (service_title || '').trim(),
        author_name.trim(),
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
