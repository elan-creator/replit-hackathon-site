'use client';

import { useState, useEffect } from 'react';
import SuccessToast from './SuccessToast';

export default function RetroForm({ onSubmitted, cohortId }: { onSubmitted: () => void; cohortId: number | null }) {
  const [authorName, setAuthorName] = useState('');
  const [keepText, setKeepText] = useState('');
  const [problemText, setProblemText] = useState('');
  const [tryText, setTryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) setError('');
  }, [success]);

  const noCohort = !cohortId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!cohortId) { setError('사이드바에서 행사를 먼저 선택해주세요.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/retrospectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName,
          keep_text: keepText,
          problem_text: problemText,
          try_text: tryText,
          cohort_id: cohortId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '회고 제출에 실패했습니다.');
      }
      setAuthorName('');
      setKeepText('');
      setProblemText('');
      setTryText('');
      setSuccess(true);
      onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {noCohort && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-yellow-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>사이드바에서 행사를 먼저 선택해주세요.</span>
        </div>
      )}

      {success && (
        <SuccessToast message="회고가 성공적으로 제출되었습니다!" onDismiss={() => setSuccess(false)} />
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">이름 *</label>
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="이름을 입력하세요"
            required
            maxLength={100}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            <span className="inline-block px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded mr-1">Keep</span>
            잘한 점, 계속하고 싶은 것 *
          </label>
          <textarea
            value={keepText}
            onChange={e => setKeepText(e.target.value)}
            placeholder="오늘 잘한 점이나 계속 유지하고 싶은 것을 적어주세요..."
            required
            maxLength={3000}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            <span className="inline-block px-1.5 py-0.5 bg-red-600/20 text-red-400 rounded mr-1">Problem</span>
            어려웠던 점, 개선하고 싶은 것 *
          </label>
          <textarea
            value={problemText}
            onChange={e => setProblemText(e.target.value)}
            placeholder="어려웠던 점이나 아쉬웠던 부분을 적어주세요..."
            required
            maxLength={3000}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            <span className="inline-block px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded mr-1">Try</span>
            다음에 시도해볼 것 *
          </label>
          <textarea
            value={tryText}
            onChange={e => setTryText(e.target.value)}
            placeholder="내일 시도해보고 싶은 것을 적어주세요..."
            required
            maxLength={3000}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || noCohort}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? '제출 중...' : '회고 제출'}
        </button>
      </form>
    </div>
  );
}
