'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import SuccessToast from '@/components/SuccessToast';
import { useCohort } from '@/contexts/CohortContext';

interface Service {
  id: number;
  url: string;
  title: string;
  thumbnail_url: string | null;
  feedback_count: number;
  created_at: string;
}

export default function FeedbackPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { selectedCohortId } = useCohort();

  const noCohort = !selectedCohortId;

  const fetchServices = useCallback(async () => {
    if (!selectedCohortId) { setLoading(false); setServices([]); return; }
    try {
      const res = await fetch(`/api/services?cohort_id=${selectedCohortId}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [selectedCohortId]);

  useEffect(() => {
    setLoading(true);
    fetchServices();
  }, [selectedCohortId, fetchServices]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!selectedCohortId) {
      setError('사이드바에서 행사를 먼저 선택해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, cohort_id: selectedCohortId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '서비스 등록에 실패했습니다.');
      }
      setUrl('');
      setTitle('');
      setShowForm(false);
      setSuccess(true);
      fetchServices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-white">서비스 피드백</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={noCohort}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? '닫기' : '서비스 등록'}
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        등록된 서비스를 클릭하여 피드백을 남겨주세요.
      </p>

      {noCohort && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-yellow-300 text-sm flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>사이드바에서 행사를 먼저 선택해주세요.</span>
        </div>
      )}

      {success && (
        <div className="mb-6">
          <SuccessToast message="서비스가 성공적으로 등록되었습니다!" onDismiss={() => setSuccess(false)} />
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddService} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="text-sm font-medium text-white">새 서비스 등록</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">서비스 URL *</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">서비스 이름 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="프로젝트 이름"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitting ? '등록 중...' : '등록'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400">등록된 서비스가 없습니다.</p>
          <p className="text-gray-500 text-sm mt-1">관리자가 서비스를 등록하면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <div key={service.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-600 transition-colors">
              <Link href={`/feedback/${service.id}`} className="block">
                <div className="aspect-[3/2] bg-gray-800 overflow-hidden">
                  {service.thumbnail_url ? (
                    <img
                      src={service.thumbnail_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <span className="text-4xl">🌐</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500 truncate mb-2">{service.url}</p>
                  <span className="text-xs text-blue-400">{service.feedback_count}개 피드백</span>
                </div>
              </Link>
              <div className="px-4 pb-3 flex justify-end">
                <DeleteButton
                  onDelete={async (password: string) => {
                    const res = await fetch(`/api/services/${service.id}`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ password }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.error || '삭제 실패');
                    }
                    fetchServices();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
