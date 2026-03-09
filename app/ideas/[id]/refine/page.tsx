import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import RefineChat from '@/components/RefineChat';

export const dynamic = 'force-dynamic';

export default async function RefinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ideaId = parseInt(id, 10);
  if (isNaN(ideaId)) notFound();

  const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [ideaId]);
  if (result.rows.length === 0) notFound();

  const idea = result.rows[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">아이디어 다듬기</h1>
        <p className="text-gray-400 text-sm">
          AI가 아이디어에서 보충하면 좋을 부분을 질문합니다. 2개의 질문에 답해주세요.
        </p>
      </div>
      <RefineChat idea={idea} />
    </div>
  );
}
