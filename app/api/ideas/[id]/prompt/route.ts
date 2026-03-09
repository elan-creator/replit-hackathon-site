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
  const a1Summary = idea.refinement_a1.split(/[.。!?\n]/)[0].trim();
  const a2Summary = idea.refinement_a2.split(/[.。!?\n]/)[0].trim();

  return `"${ideaSummary}" 앱을 만들어주세요.

주요 사용자: ${a1Summary}
핵심 기능: ${a2Summary}

한 페이지짜리 웹앱으로 만들어주세요. 외부 API 연동 없이 핵심 기능만 동작하면 됩니다. 디자인은 깔끔하고 모바일에서도 잘 보이게 해주세요.`;
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

    const systemPrompt = `사용자의 아이디어를 바탕으로 Replit Agent에 입력할 최초 셋업 프롬프트를 작성하세요.

목표: Replit Agent가 이 프롬프트만으로 5~10분 안에 동작하는 첫 화면을 만들 수 있어야 합니다.

규칙:
- 앱 이름과 한 줄 설명으로 시작
- 핵심 기능 1~3개만 포함 (MVP 수준, 외부 API 연동이나 알림 같은 부가기능 제외)
- 화면 구성은 1~2개 페이지로 제한
- 기술 스택, DB 스키마, API 설계, 테스트 시나리오 등 상세 설계는 절대 포함하지 마세요
- 전체 길이 300자 내외로 간결하게
- 한국어로 작성. 프롬프트 텍스트만 출력. 제목이나 부연 설명 없이.`;

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
