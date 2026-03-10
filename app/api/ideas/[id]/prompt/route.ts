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

  return `${ideaSummary} 앱을 만들어주세요.

1. 문제 정의
${idea.refinement_a1}

2. 핵심 기능 (MVP)
${idea.refinement_a2}

3. 사용자 플로우
- 앱 접속 → 핵심 기능 사용 → 결과 확인

4. 화면 구성
- 메인 페이지: 핵심 기능이 동작하는 단일 페이지

외부 API 연동 없이 핵심 기능만 동작하면 됩니다. 디자인은 깔끔하고 모바일에서도 잘 보이게 해주세요.`;
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

    const systemPrompt = `사용자의 아이디어와 Q&A를 바탕으로 Replit Agent에 입력할 약식 PRD(제품 요구사항) 프롬프트를 작성하세요.

아래 형식을 정확히 따르세요:

[앱 이름]: [한 줄 설명]

1. 문제 정의
- 타겟 사용자가 누구이고 어떤 불편함을 겪고 있는지 2~3문장

2. 핵심 기능 (MVP)
- 첫 버전에서 반드시 동작해야 할 기능 2~3개를 bullet으로

3. 사용자 플로우
- 사용자가 앱에 접속해서 목표를 달성하기까지의 흐름을 3~5단계로

4. 화면 구성
- 필요한 페이지/화면 1~3개와 각 화면의 핵심 요소

규칙:
- 외부 API 연동, 알림, 인증 등 부가기능은 제외하고 핵심만
- 기술 스택, DB 스키마, API 설계는 포함하지 마세요
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
      max_completion_tokens: 1000,
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
