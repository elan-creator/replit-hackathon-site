import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import openai from '@/lib/openai';

interface IdeaRow {
  id: number;
  idea_text: string;
  refinement_q1: string;
  refinement_a1: string;
  refinement_q2: string;
  refinement_a2: string;
  generated_prompt: string | null;
}

function buildFallbackPrompt(idea: IdeaRow): string {
  const ideaSummary = idea.idea_text.split(/[.。!?\n]/)[0].trim().replace(/앱\s*$/, '').trim();

  return `다음 PRD를 기반으로 웹 앱을 만들어주세요.

# ${ideaSummary}

## 1. 문제 정의
${idea.refinement_a1}

이 문제를 해결하기 위해, 사용자가 즉시 핵심 가치를 체험할 수 있는 간결한 웹 앱을 만듭니다.

## 2. 타겟 사용자
- 위 문제를 실제로 겪고 있는 사용자가 주요 대상입니다
- 별도의 회원가입 없이 URL 접속만으로 바로 사용할 수 있어야 합니다
- 모바일과 데스크톱 모두에서 사용합니다

## 3. 핵심 기능 (MVP)
${idea.refinement_a2}

위 내용을 기반으로 첫 버전에서 반드시 동작해야 하는 기능만 구현합니다:
- 데이터 입력/등록 기능
- 등록된 데이터 목록 조회 기능
- 핵심 동작(투표, 트래킹, 기록 등) 실행 및 결과 확인 기능

## 4. 사용자 플로우
1단계: 앱에 접속하면 메인 대시보드가 보입니다
2단계: 사용자가 새 항목을 등록합니다 (입력 폼 또는 모달)
3단계: 등록된 항목 목록에서 핵심 동작을 수행합니다
4단계: 결과가 실시간으로 반영되어 화면에 표시됩니다
5단계: 과거 기록을 목록 형태로 확인할 수 있습니다

## 5. 화면 구성
- 메인 페이지: 현재 상태를 한눈에 보여주는 대시보드. 핵심 동작 버튼, 항목 목록, 결과 요약이 포함됩니다
- 입력 폼: 새 항목을 등록하는 폼 (인라인 또는 모달). 필수 필드만 간결하게 구성합니다
- 기록/히스토리: 과거 데이터를 날짜별로 조회할 수 있는 목록 화면

## 6. 디자인 요구사항
- 깔끔하고 현대적인 UI (다크 모드 또는 라이트 모드)
- 모바일 반응형으로, 스마트폰에서도 편하게 사용 가능
- 직관적인 버튼과 카드 기반 레이아웃

## 7. 제약 조건
- 외부 API 연동 없이 자체 기능만으로 동작
- 인증/로그인 없이 바로 사용 가능
- 한국어 UI
- PostgreSQL 데이터베이스 사용`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ideaId = parseInt(id, 10);
    if (isNaN(ideaId)) {
      return NextResponse.json({ error: 'Invalid idea ID' }, { status: 400 });
    }

    const result = await pool.query('SELECT generated_prompt FROM ideas WHERE id = $1', [ideaId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json({ prompt: result.rows[0].generated_prompt });
  } catch (error) {
    console.error('Failed to fetch prompt:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 });
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ideaId = parseInt(id, 10);
    if (isNaN(ideaId)) {
      return NextResponse.json({ error: 'Invalid idea ID' }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [ideaId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const idea = result.rows[0];

    if (!idea.refinement_q1 || !idea.refinement_a1 || !idea.refinement_q2 || !idea.refinement_a2) {
      return NextResponse.json({ error: '아이디어 다듬기를 먼저 완료해주세요.' }, { status: 400 });
    }

    if (idea.generated_prompt) {
      return NextResponse.json({ prompt: idea.generated_prompt });
    }

    const systemPrompt = `사용자의 아이디어와 Q&A를 바탕으로 Replit Agent에 입력할 PRD(제품 요구사항 문서) 형식의 셋업 프롬프트를 작성하세요.

"다음 PRD를 기반으로 웹 앱을 만들어주세요."로 시작하고, 아래 7개 섹션을 모두 포함하세요:

# [앱 이름]

## 1. 문제 정의
- Q&A에서 파악된 타겟 사용자와 그들이 겪는 구체적인 불편함을 3~4문장으로 서술

## 2. 타겟 사용자
- 주요 사용자가 누구인지, 어떤 상황에서 사용하는지 bullet 2~3개

## 3. 핵심 기능 (MVP)
- Q&A 답변에서 추출한 핵심 기능을 3~5개 bullet으로 구체적으로 설명
- 각 기능이 사용자에게 어떤 가치를 주는지 포함

## 4. 사용자 플로우
- 앱 접속부터 목표 달성까지 5~7단계로 구체적으로 서술 (1단계, 2단계... 형식)

## 5. 화면 구성
- 2~3개 화면과 각 화면의 핵심 UI 요소를 구체적으로 설명

## 6. 디자인 요구사항
- UI 스타일, 반응형, 레이아웃 관련 요구사항 3~4개

## 7. 제약 조건
- 기술적 제약사항 3~4개

규칙:
- 전체 분량은 800~1200자 수준으로 충실하게 작성
- 사용자의 Q&A 답변 내용을 충분히 반영하여 구체화
- 한국어로 작성. 프롬프트 텍스트만 출력.`;

    const userContent = `아이디어: ${idea.idea_text}

Q1: ${idea.refinement_q1}
A1: ${idea.refinement_a1}

Q2: ${idea.refinement_q2}
A2: ${idea.refinement_a2}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_completion_tokens: 2000,
    });

    const choice = completion.choices[0];
    const generatedPrompt = choice?.message?.content?.trim() || '';

    if (!generatedPrompt) {
      const fallbackPrompt = buildFallbackPrompt(idea);
      await pool.query('UPDATE ideas SET generated_prompt = $1 WHERE id = $2', [fallbackPrompt, ideaId]);
      return NextResponse.json({ prompt: fallbackPrompt });
    }

    await pool.query('UPDATE ideas SET generated_prompt = $1 WHERE id = $2', [generatedPrompt, ideaId]);

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Failed to generate prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
