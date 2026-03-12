'use client';

import { useState, useEffect, useCallback } from 'react';
import SurveyForm from '@/components/SurveyForm';
import DeleteButton from '@/components/DeleteButton';
import { useCohort } from '@/contexts/CohortContext';

interface Survey {
  id: number;
  author_name: string;
  role: string;
  company: string | null;
  replit_experience: string;
  ai_experience: string;
  coding_experience: string;
  expectations: string[];
  goal: string | null;
  created_at: string;
}

function ExpBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    purple: 'bg-purple-600/20 text-purple-400',
  };
  return (
    <div className="flex items-start gap-2">
      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${colorMap[color]}`}>
        {label}
      </span>
      <span className="text-sm text-gray-300">{value}</span>
    </div>
  );
}

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCohortId } = useCohort();

  const fetchSurveys = useCallback(async () => {
    if (!selectedCohortId) { setLoading(false); setSurveys([]); return; }
    try {
      const res = await fetch(`/api/surveys?cohort_id=${selectedCohortId}`);
      const data = await res.json();
      setSurveys(data);
    } catch {
      console.error('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  }, [selectedCohortId]);

  useEffect(() => {
    setLoading(true);
    fetchSurveys();
  }, [selectedCohortId, fetchSurveys]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">사전 설문</h1>
      <p className="text-gray-400 text-sm mb-6">
        해커톤 참가 전 간단한 설문을 작성해주세요. 워크샵 진행에 참고됩니다.
      </p>

      <SurveyForm onSubmitted={fetchSurveys} cohortId={selectedCohortId} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          {surveys.length > 0 ? `${surveys.length}명이 설문에 참여했습니다.` : ''}
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-400">아직 제출된 설문이 없습니다. 첫 번째로 설문을 작성해보세요!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {surveys.map(survey => (
              <div key={survey.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-400">{survey.author_name}</span>
                    <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">{survey.role}</span>
                    {survey.company && (
                      <span className="text-xs text-gray-500">{survey.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {new Date(survey.created_at).toLocaleDateString('ko-KR')}
                    </span>
                    <DeleteButton
                      onDelete={async (password: string) => {
                        const res = await fetch(`/api/surveys/${survey.id}`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ password }),
                        });
                        if (!res.ok) {
                          const data = await res.json();
                          throw new Error(data.error || '삭제 실패');
                        }
                        fetchSurveys();
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <ExpBadge label="Replit" value={survey.replit_experience} color="blue" />
                  <ExpBadge label="AI" value={survey.ai_experience} color="green" />
                  <ExpBadge label="코딩" value={survey.coding_experience} color="purple" />
                </div>

                {survey.expectations && survey.expectations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {survey.expectations.map(exp => (
                      <span key={exp} className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full text-xs">
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                {survey.goal && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">활용 목표</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{survey.goal}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
