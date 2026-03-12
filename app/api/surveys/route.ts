import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const VALID_ROLES = ['PM', '디자이너', '마케터', '기획자', '대표/리더', 'HR', '재무', '영업', '기타'];
const VALID_REPLIT_EXP = ['전혀 없음', '계정만 생성', '튜토리얼 경험', '개인 프로젝트 경험', '능숙하게 사용'];
const VALID_AI_EXP = ['전혀 없음', '사용해 본 적 있음', '가끔 활용', '업무에 활용 중', '능숙하게 활용 중'];
const VALID_CODING_EXP = ['전혀 없음', '기초 지식만 있음', '간단한 스크립트 작성 가능', '프로젝트 경험 있음', '개발자 수준'];
const VALID_EXPECTATIONS = ['AI 코딩 경험', '아이디어 구체화', '직접 앱 만들기', '새로운 도구·기술 학습', '네트워킹', '기타'];

export async function GET(req: NextRequest) {
  try {
    const cohortIdParam = req.nextUrl.searchParams.get('cohort_id');
    let result;
    if (cohortIdParam) {
      const cohortId = parseInt(cohortIdParam, 10);
      if (isNaN(cohortId)) {
        return NextResponse.json({ error: 'Invalid cohort_id' }, { status: 400 });
      }
      result = await pool.query('SELECT * FROM surveys WHERE cohort_id = $1 ORDER BY created_at DESC', [cohortId]);
    } else {
      result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
    }
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch surveys:', error);
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author_name, role, company, replit_experience, ai_experience, coding_experience, expectations, goal, cohort_id } = body;

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length === 0 || author_name.length > 100) {
      return NextResponse.json({ error: '이름을 입력해주세요. (최대 100자)' }, { status: 400 });
    }
    if (!role || (!VALID_ROLES.includes(role) && !role.startsWith('기타: '))) {
      return NextResponse.json({ error: '직군/역할을 선택해주세요.' }, { status: 400 });
    }
    if (company && (typeof company !== 'string' || company.length > 100)) {
      return NextResponse.json({ error: '회사/소속은 최대 100자까지 입력 가능합니다.' }, { status: 400 });
    }
    if (!replit_experience || !VALID_REPLIT_EXP.includes(replit_experience)) {
      return NextResponse.json({ error: 'Replit 사용 경험을 선택해주세요.' }, { status: 400 });
    }
    if (!ai_experience || !VALID_AI_EXP.includes(ai_experience)) {
      return NextResponse.json({ error: 'AI 코딩 어시스턴트 경험을 선택해주세요.' }, { status: 400 });
    }
    if (!coding_experience || !VALID_CODING_EXP.includes(coding_experience)) {
      return NextResponse.json({ error: '코딩 경험을 선택해주세요.' }, { status: 400 });
    }
    if (expectations && !Array.isArray(expectations)) {
      return NextResponse.json({ error: '기대치 형식이 올바르지 않습니다.' }, { status: 400 });
    }
    if (expectations) {
      for (const exp of expectations) {
        if (!VALID_EXPECTATIONS.includes(exp) && !exp.startsWith('기타: ')) {
          return NextResponse.json({ error: `올바르지 않은 기대치 항목: ${exp}` }, { status: 400 });
        }
      }
    }
    if (!cohort_id || typeof cohort_id !== 'number') {
      return NextResponse.json({ error: '행사를 선택해주세요.' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO surveys (author_name, role, company, replit_experience, ai_experience, coding_experience, expectations, goal, cohort_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        author_name.trim(),
        role,
        company?.trim() || null,
        replit_experience,
        ai_experience,
        coding_experience,
        expectations || [],
        goal?.trim() || null,
        cohort_id,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create survey:', error);
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
  }
}
