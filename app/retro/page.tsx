'use client';

import { useState, useEffect, useCallback } from 'react';
import RetroForm from '@/components/RetroForm';
import DeleteButton from '@/components/DeleteButton';

interface Retrospective {
  id: number;
  author_name: string;
  keep_text: string;
  problem_text: string;
  try_text: string;
  created_at: string;
}

export default function RetroPage() {
  const [retros, setRetros] = useState<Retrospective[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRetros = useCallback(async () => {
    try {
      const res = await fetch('/api/retrospectives');
      const data = await res.json();
      setRetros(data);
    } catch {
      console.error('Failed to fetch retrospectives');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetros();
  }, [fetchRetros]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">일일 회고</h1>
      <p className="text-gray-400 text-sm mb-6">
        오늘 하루를 KPT(Keep, Problem, Try) 프레임워크로 돌아보세요. 다른 참가자들의 회고도 함께 확인할 수 있습니다.
      </p>

      <RetroForm onSubmitted={fetchRetros} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          {retros.length > 0 ? `${retros.length}개의 회고가 등록되었습니다.` : ''}
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        ) : retros.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400">아직 등록된 회고가 없습니다. 첫 번째 회고를 작성해보세요!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {retros.map(retro => (
              <div key={retro.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-400">{retro.author_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {new Date(retro.created_at).toLocaleDateString('ko-KR')}
                    </span>
                    <DeleteButton
                      onDelete={async (password: string) => {
                        const res = await fetch(`/api/retrospectives/${retro.id}`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ password }),
                        });
                        if (!res.ok) {
                          const data = await res.json();
                          throw new Error(data.error || '삭제 실패');
                        }
                        fetchRetros();
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded text-xs font-medium mb-1">Keep</span>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{retro.keep_text}</p>
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 bg-red-600/20 text-red-400 rounded text-xs font-medium mb-1">Problem</span>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{retro.problem_text}</p>
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-medium mb-1">Try</span>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{retro.try_text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
