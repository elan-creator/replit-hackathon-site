'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IdeaForm({ cohortId }: { cohortId?: number | null }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState('');
  const [ideaText, setIdeaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const noCohort = !cohortId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cohortId) {
      setError('사이드바에서 행사를 먼저 선택해주세요.');
      return;
    }

    if (!authorName.trim() || !ideaText.trim()) {
      setError('이름과 아이디어를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName.trim(),
          idea_text: ideaText.trim(),
          cohort_id: cohortId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit idea');
      }

      const idea = await res.json();
      router.push(`/ideas/${idea.id}/refine`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {noCohort && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-yellow-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>사이드바에서 행사를 먼저 선택해주세요.</span>
        </div>
      )}

      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-2">
          이름
        </label>
        <input
          id="authorName"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="홍길동"
          maxLength={100}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="ideaText" className="block text-sm font-medium text-gray-300 mb-2">
          어떤 걸 만들고 싶은지 자유롭게 적어주세요
        </label>
        <textarea
          id="ideaText"
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder="예: 우리 팀의 회의록을 자동으로 정리해주는 도구를 만들고 싶어요. 회의가 끝나면 핵심 내용과 할 일 목록을 정리해서 슬랙으로 보내주는..."
          rows={6}
          maxLength={5000}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
        <p className="mt-1 text-xs text-gray-500">{ideaText.length}/5000</p>
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || noCohort}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isSubmitting ? '제출 중...' : '아이디어 제출하고 다듬기 시작'}
      </button>
    </form>
  );
}
