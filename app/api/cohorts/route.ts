import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyDeletePassword } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM cohorts WHERE is_active = true ORDER BY event_date DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch cohorts:', error);
    return NextResponse.json({ error: 'Failed to fetch cohorts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_date, company, password } = body;

    if (!verifyDeletePassword(password)) {
      return NextResponse.json({ error: '관리자 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    if (!event_date) {
      return NextResponse.json({ error: '행사 날짜를 입력해주세요.' }, { status: 400 });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(event_date)) {
      return NextResponse.json({ error: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)' }, { status: 400 });
    }

    if (company && (typeof company !== 'string' || company.length > 100)) {
      return NextResponse.json({ error: '회사/주제는 최대 100자까지 입력 가능합니다.' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO cohorts (event_date, company) VALUES ($1, $2) RETURNING *`,
      [event_date, company?.trim() || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505') {
      return NextResponse.json({ error: '해당 날짜의 행사가 이미 등록되어 있습니다.' }, { status: 409 });
    }
    console.error('Failed to create cohort:', error);
    return NextResponse.json({ error: 'Failed to create cohort' }, { status: 500 });
  }
}
