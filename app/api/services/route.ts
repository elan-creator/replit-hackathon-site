import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT s.*, COUNT(f.id)::int AS feedback_count
      FROM services s
      LEFT JOIN feedbacks f ON f.service_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title } = body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json({ error: '서비스 URL을 입력해주세요.' }, { status: 400 });
    }
    try {
      const parsed = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'http 또는 https URL만 허용됩니다.' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: '올바른 URL 형식이 아닙니다.' }, { status: 400 });
    }
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: '서비스 이름을 입력해주세요.' }, { status: 400 });
    }

    const thumbnailUrl = `https://image.thum.io/get/width/600/crop/400/${encodeURIComponent(url.trim())}`;

    const result = await pool.query(
      `INSERT INTO services (url, title, thumbnail_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [url.trim(), title.trim(), thumbnailUrl]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505') {
      return NextResponse.json({ error: '이미 등록된 URL입니다.' }, { status: 409 });
    }
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
