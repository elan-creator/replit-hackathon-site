'use client';

import { useState, useEffect } from 'react';
import SuccessToast from './SuccessToast';

const ROLES = ['PM', '디자이너', '마케터', '기획자', '대표/리더', 'HR', '재무', '영업', '기타'];
const REPLIT_LEVELS = ['전혀 없음', '계정만 생성', '튜토리얼 경험', '개인 프로젝트 경험', '능숙하게 사용'];
const AI_LEVELS = ['전혀 없음', '사용해 본 적 있음', '가끔 활용', '업무에 활용 중', '능숙하게 활용 중'];
const CODING_LEVELS = ['전혀 없음', '기초 지식만 있음', '간단한 스크립트 작성 가능', '프로젝트 경험 있음', '개발자 수준'];
const EXPECTATION_OPTIONS = ['AI 코딩 경험', '아이디어 구체화', '직접 앱 만들기', '새로운 도구·기술 학습', '네트워킹', '기타'];

function RadioGroup({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">{label} *</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              value === opt
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function LevelSelector({ label, levels, value, onChange }: {
  label: string;
  levels: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">{label} *</label>
      <div className="space-y-1.5">
        {levels.map((level, idx) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors border text-left ${
              value === level
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            <div className="flex gap-1">
              {levels.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= idx
                      ? value === level ? 'bg-blue-400' : 'bg-gray-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span>{level}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SurveyForm({ onSubmitted, cohortId }: { onSubmitted: () => void; cohortId: number | null }) {
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [roleCustom, setRoleCustom] = useState('');
  const [company, setCompany] = useState('');
  const [replitExp, setReplitExp] = useState('');
  const [aiExp, setAiExp] = useState('');
  const [codingExp, setCodingExp] = useState('');
  const [expectations, setExpectations] = useState<string[]>([]);
  const [expectationCustom, setExpectationCustom] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) setError('');
  }, [success]);

  const toggleExpectation = (exp: string) => {
    setExpectations(prev => {
      if (prev.includes(exp)) {
        if (exp === '기타') setExpectationCustom('');
        return prev.filter(e => e !== exp);
      }
      return [...prev, exp];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!cohortId) { setError('사이드바에서 행사를 먼저 선택해주세요.'); return; }
    if (!authorName.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!role) { setError('직군/역할을 선택해주세요.'); return; }
    if (role === '기타' && !roleCustom.trim()) { setError('직군/역할을 직접 입력해주세요.'); return; }
    if (!replitExp) { setError('Replit 사용 경험을 선택해주세요.'); return; }
    if (!aiExp) { setError('AI 코딩 어시스턴트 경험을 선택해주세요.'); return; }
    if (!codingExp) { setError('코딩 경험을 선택해주세요.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName,
          role: role === '기타' ? `기타: ${roleCustom.trim()}` : role,
          company: company || null,
          replit_experience: replitExp,
          ai_experience: aiExp,
          coding_experience: codingExp,
          expectations: expectations.map(e => e === '기타' && expectationCustom.trim() ? `기타: ${expectationCustom.trim()}` : e),
          goal: goal || null,
          cohort_id: cohortId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '설문 제출에 실패했습니다.');
      }
      setAuthorName('');
      setRole('');
      setRoleCustom('');
      setCompany('');
      setReplitExp('');
      setAiExp('');
      setCodingExp('');
      setExpectations([]);
      setExpectationCustom('');
      setGoal('');
      setSuccess(true);
      onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const noCohort = !cohortId;

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

      {success && (
        <SuccessToast message="설문이 성공적으로 제출되었습니다!" onDismiss={() => setSuccess(false)} />
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">1</span>
          참가자 기본 정보
        </h3>
        <div>
          <label className="block text-xs text-gray-400 mb-1">이름/닉네임 *</label>
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
        <RadioGroup label="직군/역할" options={ROLES} value={role} onChange={(v) => { setRole(v); if (v !== '기타') setRoleCustom(''); }} />
        {role === '기타' && (
          <div>
            <input
              type="text"
              value={roleCustom}
              onChange={e => setRoleCustom(e.target.value)}
              placeholder="직군/역할을 직접 입력해주세요"
              maxLength={50}
              autoFocus
              className="w-full px-3 py-2 bg-gray-800 border border-blue-500 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-400 mb-1">회사/소속</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="회사 또는 소속을 입력하세요 (선택)"
            maxLength={100}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">2</span>
          사전 지식 및 경험
        </h3>
        <LevelSelector label="Replit 사용 경험" levels={REPLIT_LEVELS} value={replitExp} onChange={setReplitExp} />
        <LevelSelector label="AI 코딩 어시스턴트 사용 경험 (ChatGPT, Claude 등)" levels={AI_LEVELS} value={aiExp} onChange={setAiExp} />
        <LevelSelector label="코딩 경험" levels={CODING_LEVELS} value={codingExp} onChange={setCodingExp} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs">3</span>
          해커톤 기대치
        </h3>
        <div>
          <label className="block text-xs text-gray-400 mb-2">이번 해커톤을 통해 가장 얻고 싶은 것은? (복수 선택 가능)</label>
          <div className="flex flex-wrap gap-2">
            {EXPECTATION_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleExpectation(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  expectations.includes(opt)
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {expectations.includes('기타') && (
            <input
              type="text"
              value={expectationCustom}
              onChange={e => setExpectationCustom(e.target.value)}
              placeholder="기대하는 것을 직접 입력해주세요"
              maxLength={100}
              autoFocus
              className="w-full mt-2 px-3 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-400"
            />
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">궁극적으로 Replit과 AI 코딩을 어디에 활용하고 싶으신가요?</label>
          <textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="예: 사내 업무 자동화 도구를 직접 만들고 싶습니다..."
            maxLength={3000}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || noCohort}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? '제출 중...' : '설문 제출'}
      </button>
    </form>
  );
}
