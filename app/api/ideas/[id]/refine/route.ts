import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import openai from '@/lib/openai';

export async function POST(
  req: NextRequest,
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
    const body = await req.json();
    const step = body?.step;

    if (step !== 1 && step !== 2) {
      return NextResponse.json({ error: 'step must be 1 or 2' }, { status: 400 });
    }

    let context = `아이디어: ${idea.idea_text}`;

    if (step === 2 && idea.refinement_q1 && idea.refinement_a1) {
      context += `\n\n이전 질문: ${idea.refinement_q1}\n답변: ${idea.refinement_a1}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: `당신은 워크숍 참석자의 아이디어를 다듬어주는 코치입니다.
참석자가 작성한 아이디어를 읽고, 부족하거나 더 구체화하면 좋을 부분을 파악하세요.
타겟 사용자, 해결하려는 문제, 핵심 기능, 실현 가능성, 차별점 등의 관점에서 생각해보세요.
짧고 친근한 한국어 질문 1개만 생성하세요. 질문만 출력하세요.`
        },
        {
          role: 'user',
          content: context,
        },
      ],
      max_tokens: 200,
    });

    const question = completion.choices[0]?.message?.content?.trim() || '이 아이디어에 대해 더 자세히 알려주세요.';

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Failed to generate question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ideaId = parseInt(id, 10);
    if (isNaN(ideaId)) {
      return NextResponse.json({ error: 'Invalid idea ID' }, { status: 400 });
    }

    const body = await req.json();
    const { step, question, answer } = body;

    if (step !== 1 && step !== 2) {
      return NextResponse.json({ error: 'step must be 1 or 2' }, { status: 400 });
    }

    if (!question || typeof question !== 'string' || !answer || typeof answer !== 'string') {
      return NextResponse.json(
        { error: 'question and answer are required strings' },
        { status: 400 }
      );
    }

    if (answer.length > 5000) {
      return NextResponse.json(
        { error: 'answer must be 5000 characters or less' },
        { status: 400 }
      );
    }

    let query: string;
    let values: (string | number)[];

    if (step === 1) {
      query = 'UPDATE ideas SET refinement_q1 = $1, refinement_a1 = $2 WHERE id = $3 RETURNING *';
      values = [question.trim(), answer.trim(), ideaId];
    } else if (step === 2) {
      query = 'UPDATE ideas SET refinement_q2 = $1, refinement_a2 = $2 WHERE id = $3 RETURNING *';
      values = [question.trim(), answer.trim(), ideaId];
    } else {
      return NextResponse.json({ error: 'step must be 1 or 2' }, { status: 400 });
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to save refinement:', error);
    return NextResponse.json({ error: 'Failed to save refinement' }, { status: 500 });
  }
}
