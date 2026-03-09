import pool from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ideaId = parseInt(id, 10);

  if (isNaN(ideaId)) {
    notFound();
  }

  const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [ideaId]);
  if (result.rows.length === 0) {
    notFound();
  }

  const idea = result.rows[0];
  const hasRefinement = idea.refinement_q1 && idea.refinement_a1;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/ideas/gallery"
          className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
        >
          &larr; 모아보기로 돌아가기
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-400">{idea.author_name}</span>
          <span className="text-xs text-gray-500">
            {new Date(idea.created_at).toLocaleDateString('ko-KR')}
          </span>
        </div>

        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
          {idea.idea_text}
        </p>
      </div>

      {hasRefinement && (
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">아이디어 다듬기 결과</h2>

          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-400">Q. {idea.refinement_q1}</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{idea.refinement_a1}</p>
          </div>

          {idea.refinement_q2 && idea.refinement_a2 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-400">Q. {idea.refinement_q2}</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{idea.refinement_a2}</p>
            </div>
          )}
        </div>
      )}

      {!hasRefinement && (
        <div className="mt-6 text-center py-8">
          <p className="text-gray-500 text-sm mb-3">아직 아이디어를 다듬지 않았어요.</p>
          <Link
            href={`/ideas/${idea.id}/refine`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            아이디어 다듬기
          </Link>
        </div>
      )}
    </div>
  );
}
