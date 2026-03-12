import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const cohortIdParam = req.nextUrl.searchParams.get('cohort_id');
    let result;
    if (cohortIdParam) {
      const cohortId = parseInt(cohortIdParam, 10);
      if (isNaN(cohortId)) {
        return NextResponse.json({ error: 'Invalid cohort_id' }, { status: 400 });
      }
      result = await pool.query('SELECT * FROM retrospectives WHERE cohort_id = $1 ORDER BY created_at DESC', [cohortId]);
    } else {
      result = await pool.query('SELECT * FROM retrospectives ORDER BY created_at DESC');
    }
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch retrospectives:', error);
    return NextResponse.json({ error: 'Failed to fetch retrospectives' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author_name, keep_text, problem_text, try_text, cohort_id } = body;

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length === 0 || author_name.length > 100) {
      return NextResponse.json({ error: '이름을 입력해주세요. (최대 100자)' }, { status: 400 });
    }
    if (!keep_text || typeof keep_text !== 'string' || keep_text.trim().length === 0 || keep_text.length > 3000) {
      return NextResponse.json({ error: 'Keep 항목을 입력해주세요. (최대 3000자)' }, { status: 400 });
    }
    if (!problem_text || typeof problem_text !== 'string' || problem_text.trim().length === 0 || problem_text.length > 3000) {
      return NextResponse.json({ error: 'Problem 항목을 입력해주세요. (최대 3000자)' }, { status: 400 });
    }
    if (!try_text || typeof try_text !== 'string' || try_text.trim().length === 0 || try_text.length > 3000) {
      return NextResponse.json({ error: 'Try 항목을 입력해주세요. (최대 3000자)' }, { status: 400 });
    }
    if (!cohort_id || typeof cohort_id !== 'number') {
      return NextResponse.json({ error: '행사를 선택해주세요.' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO retrospectives (author_name, keep_text, problem_text, try_text, cohort_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [author_name.trim(), keep_text.trim(), problem_text.trim(), try_text.trim(), cohort_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create retrospective:', error);
    return NextResponse.json({ error: 'Failed to create retrospective' }, { status: 500 });
  }
}
