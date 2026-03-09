import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import openai from '@/lib/openai';

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

    const systemPrompt = `사용자의 아이디어를 바탕으로 Replit Agent에 입력할 앱 개발 프롬프트를 작성하세요.

포함할 내용: 앱 목적, 타겟 사용자, 핵심 기능, 사용자 플로우, 데이터 구조, UI 구성.
한국어로 작성. 프롬프트만 출력. 부연 설명 없이.`;

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
      max_completion_tokens: 4000,
    });

    const generatedPrompt = completion.choices[0]?.message?.content?.trim() || '';

    if (!generatedPrompt) {
      return NextResponse.json({ error: '프롬프트 생성에 실패했습니다.' }, { status: 500 });
    }

    await pool.query('UPDATE ideas SET generated_prompt = $1 WHERE id = $2', [generatedPrompt, ideaId]);

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Failed to generate prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
