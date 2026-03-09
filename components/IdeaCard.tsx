'use client';

import Link from 'next/link';
import DeleteButton from './DeleteButton';

interface Idea {
  id: number;
  author_name: string;
  idea_text: string;
  refinement_q1: string | null;
  refinement_a1: string | null;
  refinement_q2: string | null;
  refinement_a2: string | null;
  created_at: string;
}

export default function IdeaCard({ idea, onDeleted }: { idea: Idea; onDeleted?: () => void }) {
  const hasRefinement = idea.refinement_q1 && idea.refinement_a1;

  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/ideas/${idea.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || '삭제 실패');
    }
    onDeleted?.();
  };

  return (
    <div className="relative">
      <Link href={`/ideas/${idea.id}`} className="block p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-600 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-400">{idea.author_name}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {new Date(idea.created_at).toLocaleDateString('ko-KR')}
            </span>
            <DeleteButton onDelete={handleDelete} />
          </div>
        </div>

        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical' }}>
          {idea.idea_text}
        </p>

        {hasRefinement && (
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500 font-medium">다듬기 답변</p>
            <div className="space-y-2">
              <div className="text-xs">
                <p className="text-gray-500">Q: {idea.refinement_q1}</p>
                <p className="text-gray-300 mt-0.5">{idea.refinement_a1}</p>
              </div>
              {idea.refinement_q2 && idea.refinement_a2 && (
                <div className="text-xs">
                  <p className="text-gray-500">Q: {idea.refinement_q2}</p>
                  <p className="text-gray-300 mt-0.5">{idea.refinement_a2}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasRefinement && (
          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs text-gray-500 italic">아직 다듬기 전이에요</span>
          </div>
        )}
      </Link>
    </div>
  );
}
