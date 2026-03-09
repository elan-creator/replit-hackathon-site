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

    let systemPrompt: string;
    let userContent: string;

    if (step === 1) {
      systemPrompt = `당신은 PRD(제품 요구사항 문서)를 작성하기 위해 아이디어를 구체화시키는 프로덕트 코치입니다.

참석자의 아이디어를 분석하고, 아래 PRD 핵심 요소 중 가장 부족한 1가지를 골라 구체적인 질문을 하세요:
- 타겟 사용자: 누가 이걸 쓸 건지, 어떤 상황에서 쓸 건지
- 핵심 문제: 지금 이 사람들이 겪고 있는 구체적인 불편함이 뭔지
- 사용 시나리오: 사용자가 이 앱을 열고 가장 먼저 하는 행동이 뭔지
- MVP 기능: 첫 버전에 반드시 들어가야 할 기능 1~2개가 뭔지
- 데이터: 어떤 데이터를 입력받고 어떤 결과를 보여줄 건지

규칙:
- 질문은 한국어로, 2문장 이내로 작성
- "더 자세히 알려주세요", "어떤 건가요?" 같은 뜻풀이용 질문 금지
- 반드시 아이디어 내용을 언급하면서 구체적으로 물어볼 것
- 질문만 출력하세요`;
      userContent = `아이디어: ${idea.idea_text}`;
    } else {
      systemPrompt = `당신은 PRD(제품 요구사항 문서)를 작성하기 위해 아이디어를 디벨롭시키는 프로덕트 코치입니다.

참석자의 아이디어와 이전 Q&A를 읽고, 아직 구체화되지 않은 부분을 파악하세요.
아래 관점 중 이전 질문에서 다루지 않은 1가지를 골라 질문하세요:
- 구현 방식: 핵심 기능이 기술적으로 어떻게 동작할지
- 사용 흐름: 사용자가 처음 접속해서 목표를 달성하기까지의 단계
- 성공 지표: 이 앱이 잘 되고 있는지 어떻게 판단할 건지
- 차별점: 기존에 비슷한 걸 쓰고 있다면 뭐가 불편해서 새로 만들려는 건지
- 확장 가능성: 첫 버전 이후 어떤 기능을 추가하고 싶은지

규칙:
- 질문은 한국어로, 2문장 이내로 작성
- 이전 답변 내용을 반영해서 한 단계 더 깊이 들어가는 질문을 할 것
- "더 자세히 알려주세요" 같은 일반적인 질문 금지
- 질문만 출력하세요`;
      userContent = `아이디어: ${idea.idea_text}\n\n이전 질문: ${idea.refinement_q1}\n답변: ${idea.refinement_a1}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_completion_tokens: 200,
    });

    const question = completion.choices[0]?.message?.content?.trim() || (
      step === 1
        ? '이 아이디어를 가장 먼저 사용할 사람은 누구이고, 그 사람이 지금 겪고 있는 가장 큰 불편함은 무엇인가요?'
        : '첫 버전에서 반드시 동작해야 하는 핵심 기능 1가지는 무엇이고, 사용자는 그 기능을 어떤 상황에서 쓰게 되나요?'
    );

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
