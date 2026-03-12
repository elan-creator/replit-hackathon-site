'use client';

import { useState, useEffect, useRef } from 'react';
import { useCohort } from '@/contexts/CohortContext';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

interface Cohort {
  id: number;
  event_date: string;
  company: string | null;
  is_active: boolean;
}

function getCohortLabel(cohort: Cohort): string {
  const date = formatDate(cohort.event_date);
  return cohort.company ? `${date} · ${cohort.company}` : date;
}

export default function CohortSelector() {
  const { cohorts, selectedCohortId, setSelectedCohortId, refreshCohorts, isLoading } = useCohort();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
      await refreshCohorts();
      setSelectedCohortId(created.id);
      setIsOpen(false);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="h-5 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {selectedCohort ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors text-left"
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            new Date(selectedCohort.event_date) >= today ? 'bg-green-400' : 'bg-gray-500'
          }`} />
          <span className="text-sm font-medium text-white truncate flex-1">{getCohortLabel(selectedCohort)}</span>
          <span className="text-xs text-gray-500">▼</span>
        </button>
      ) : (
        <button
          onClick={() => { setIsOpen(!isOpen); setShowAddForm(true); }}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-sm text-gray-400 text-left"
        >
          + 행사를 등록해주세요
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {cohorts.length > 0 && (
            <div className="max-h-48 overflow-y-auto">
              {cohorts.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCohortId(c.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    c.id === selectedCohortId
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    new Date(c.event_date) >= today ? 'bg-green-400' : 'bg-gray-500'
                  }`} />
                  <span className="truncate">{getCohortLabel(c)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-gray-700">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                + 새 행사 등록
              </button>
            ) : (
              <div className="p-3 space-y-2">
                <p className="text-xs font-medium text-gray-400">새 행사 등록 (관리자)</p>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="회사/주제 (선택)"
                  maxLength={100}
                  className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={adminPw}
                  onChange={e => setAdminPw(e.target.value)}
                  placeholder="관리자 비밀번호"
                  className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                {addError && <p className="text-xs text-red-400">{addError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {adding ? '등록 중...' : '등록'}
                  </button>
                  <button
                    onClick={() => { setShowAddForm(false); setAddError(''); }}
                    className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
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
