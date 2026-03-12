'use client';

import { useState, useEffect, useCallback } from 'react';
import IdeaCard from '@/components/IdeaCard';
import Link from 'next/link';
import { useCohort } from '@/contexts/CohortContext';

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

export default function GalleryPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCohortId } = useCohort();

  const fetchIdeas = useCallback(async () => {
    if (!selectedCohortId) { setLoading(false); setIdeas([]); return; }
    try {
      const res = await fetch(`/api/ideas?cohort_id=${selectedCohortId}`);
      if (res.ok) setIdeas(await res.json());
    } catch {
      console.error('Failed to fetch ideas');
    } finally {
      setLoading(false);
    }
  }, [selectedCohortId]);

  useEffect(() => {
    setLoading(true);
    fetchIdeas();
  }, [selectedCohortId, fetchIdeas]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">아이디어 모아보기</h1>
          <p className="text-gray-400 text-sm">
            {loading
              ? '불러오는 중...'
              : ideas.length > 0
                ? `총 ${ideas.length}개의 아이디어가 등록되었습니다.`
                : '아직 등록된 아이디어가 없습니다.'}
          </p>
        </div>
        <Link
          href="/ideas"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          새 아이디어 작성
        </Link>
      </div>

      {!loading && ideas.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💭</div>
          <p className="text-gray-400">첫 번째 아이디어를 등록해보세요!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onDeleted={fetchIdeas} />
          ))}
        </div>
      )}
    </div>
  );
}
