'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Cohort {
  id: number;
  event_date: string;
  company: string | null;
  is_active: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function getCohortLabel(cohort: Cohort): string {
  const date = formatDate(cohort.event_date);
  return cohort.company ? `${date} · ${cohort.company}` : date;
}

function findDefaultCohort(cohorts: Cohort[]): Cohort | null {
  if (cohorts.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const future = cohorts
    .filter(c => new Date(c.event_date) >= today)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  if (future.length > 0) return future[0];

  const past = cohorts
    .filter(c => new Date(c.event_date) < today)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

  return past.length > 0 ? past[0] : cohorts[0];
}

export default function CohortSelector({
  selectedCohortId,
  onSelect,
}: {
  selectedCohortId: number | null;
  onSelect: (cohortId: number | null) => void;
}) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const fetchCohorts = useCallback(async () => {
    try {
      const res = await fetch('/api/cohorts');
      if (res.ok) {
        const data: Cohort[] = await res.json();
        setCohorts(data);
        return data;
      }
    } catch {
      console.error('Failed to fetch cohorts');
    }
    return [];
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    fetchCohorts().then(data => {
      if (!selectedCohortId && data.length > 0) {
        const def = findDefaultCohort(data);
        if (def) onSelect(def.id);
      }
    });
  }, [fetchCohorts, selectedCohortId, onSelect]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);

  const handleAdd = async () => {
    setAddError('');
    if (!newDate) { setAddError('날짜를 선택해주세요.'); return; }
    if (!adminPw) { setAddError('관리자 비밀번호를 입력해주세요.'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_date: newDate, company: newCompany || null, password: adminPw }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '등록 실패');
      }
      const created = await res.json();
      setNewDate('');
      setNewCompany('');
      setAdminPw('');
      setShowAddForm(false);
      const updated = await fetchCohorts();
      if (updated.length > 0) {
        onSelect(created.id);
      }
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setAdding(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      <div className="flex items-center gap-3">
        {selectedCohort ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${
              new Date(selectedCohort.event_date) >= today ? 'bg-green-400' : 'bg-gray-500'
            }`} />
            <span className="text-sm font-medium text-white">{getCohortLabel(selectedCohort)}</span>
            <span className="text-xs text-gray-500">▼</span>
          </button>
        ) : (
          <button
            onClick={() => { setIsOpen(!isOpen); setShowAddForm(true); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-sm text-gray-400"
          >
            + 행사를 등록해주세요
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {cohorts.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {cohorts.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onSelect(c.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    c.id === selectedCohortId
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    new Date(c.event_date) >= today ? 'bg-green-400' : 'bg-gray-500'
                  }`} />
                  <span>{getCohortLabel(c)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-gray-700">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                + 새 행사 등록
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-xs font-medium text-gray-400">새 행사 등록 (관리자)</p>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="회사/주제 (선택)"
                  maxLength={100}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={adminPw}
                  onChange={e => setAdminPw(e.target.value)}
                  placeholder="관리자 비밀번호"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                {addError && <p className="text-xs text-red-400">{addError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {adding ? '등록 중...' : '등록'}
                  </button>
                  <button
                    onClick={() => { setShowAddForm(false); setAddError(''); }}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
