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
      result = await pool.query('SELECT * FROM ideas WHERE cohort_id = $1 ORDER BY created_at DESC', [cohortId]);
    } else {
      result = await pool.query('SELECT * FROM ideas ORDER BY created_at DESC');
    }
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author_name, idea_text, cohort_id } = body;

    if (!author_name || !idea_text) {
      return NextResponse.json(
        { error: 'author_name and idea_text are required' },
        { status: 400 }
      );
    }

    if (author_name.length > 100) {
      return NextResponse.json(
        { error: 'author_name must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (idea_text.length > 5000) {
      return NextResponse.json(
        { error: 'idea_text must be 5000 characters or less' },
        { status: 400 }
      );
    }
    if (!cohort_id || typeof cohort_id !== 'number') {
      return NextResponse.json({ error: '행사를 선택해주세요.' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO ideas (author_name, idea_text, cohort_id) VALUES ($1, $2, $3) RETURNING *',
      [author_name.trim(), idea_text.trim(), cohort_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
