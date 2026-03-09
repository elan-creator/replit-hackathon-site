'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Service {
  id: number;
  url: string;
  title: string;
  thumbnail_url: string | null;
}

interface Feedback {
  id: number;
  author_name: string;
  feedback_text: string;
  image_data: string | null;
  created_at: string;
}

export default function ServiceFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const [svcRes, fbRes] = await Promise.all([
        fetch(`/api/services/${id}`),
        fetch(`/api/services/${id}/feedback`),
      ]);
      if (svcRes.ok) {
        setService(await svcRes.json());
      }
      if (fbRes.ok) {
        const data = await fbRes.json();
        setFeedbacks(data);
      }
    } catch {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지는 5MB 이하만 첨부할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) processImageFile(file);
        return;
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/services/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_text: feedbackText,
          image_data: imagePreview,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '피드백 제출에 실패했습니다.');
      }
      setFeedbackText('');
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm">불러오는 중...</p>;
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">서비스를 찾을 수 없습니다.</p>
        <Link href="/feedback" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
          돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/feedback" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
          &larr; 서비스 목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
        {service.thumbnail_url && (
          <div className="aspect-[3/1] bg-gray-800 overflow-hidden">
            <img
              src={service.thumbnail_url}
              alt={service.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
        <div className="p-5">
          <h1 className="text-2xl font-bold text-white mb-1">{service.title}</h1>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline break-all"
          >
            {service.url}
          </a>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">피드백 남기기</h2>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">피드백 내용 *</label>
            <textarea
              ref={textareaRef}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              onPaste={handlePaste}
              placeholder="서비스에 대한 피드백을 작성해주세요... (이미지를 Ctrl+V로 붙여넣을 수 있습니다)"
              required
              maxLength={5000}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">{feedbackText.length}/5000</div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">스크린샷 첨부 (선택, 또는 위 텍스트 영역에 Ctrl+V)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
            />
            {imagePreview && (
              <div className="mt-2 relative inline-block">
                <img src={imagePreview} alt="미리보기" className="max-h-40 rounded-lg border border-gray-700" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700"
                >
                  X
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitting ? '제출 중...' : '피드백 제출'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {feedbacks.length > 0 ? `피드백 ${feedbacks.length}개` : ''}
        </h2>
        {feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">아직 피드백이 없습니다. 첫 번째 피드백을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map(fb => (
              <div key={fb.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(fb.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{fb.feedback_text}</p>
                {fb.image_data && (
                  <img
                    src={fb.image_data}
                    alt="첨부 이미지"
                    className="mt-2 max-h-60 rounded-lg border border-gray-700"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
