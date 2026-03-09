'use client';

import { useState, useRef } from 'react';

export default function FeedbackForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [serviceUrl, setServiceUrl] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지는 5MB 이하만 첨부할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_url: serviceUrl,
          service_title: serviceTitle,
          author_name: authorName,
          feedback_text: feedbackText,
          image_data: imagePreview,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '피드백 제출에 실패했습니다.');
      }
      setServiceUrl('');
      setServiceTitle('');
      setFeedbackText('');
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
      onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">서비스 URL *</label>
          <input
            type="url"
            value={serviceUrl}
            onChange={e => setServiceUrl(e.target.value)}
            placeholder="https://..."
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">서비스 이름 (선택)</label>
          <input
            type="text"
            value={serviceTitle}
            onChange={e => setServiceTitle(e.target.value)}
            placeholder="프로젝트 이름"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

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
        <label className="block text-xs text-gray-400 mb-1">피드백 내용 *</label>
        <textarea
          value={feedbackText}
          onChange={e => setFeedbackText(e.target.value)}
          placeholder="서비스에 대한 피드백을 작성해주세요..."
          required
          maxLength={5000}
          rows={4}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
        <div className="text-right text-xs text-gray-500 mt-1">{feedbackText.length}/5000</div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">스크린샷 첨부 (선택)</label>
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
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? '제출 중...' : '피드백 제출'}
      </button>
    </form>
  );
}
