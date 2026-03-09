'use client';

import { useState, useEffect, useCallback } from 'react';
import FeedbackForm from '@/components/FeedbackForm';

interface Feedback {
  id: number;
  service_url: string;
  service_title: string;
  author_name: string;
  feedback_text: string;
  image_data: string | null;
  created_at: string;
}

interface ServiceGroup {
  url: string;
  title: string;
  feedbacks: Feedback[];
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch {
      console.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const grouped: ServiceGroup[] = [];
  const urlMap = new Map<string, ServiceGroup>();
  for (const fb of feedbacks) {
    if (!urlMap.has(fb.service_url)) {
      const group: ServiceGroup = {
        url: fb.service_url,
        title: fb.service_title || fb.service_url,
        feedbacks: [],
      };
      urlMap.set(fb.service_url, group);
      grouped.push(group);
    }
    urlMap.get(fb.service_url)!.feedbacks.push(fb);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">서비스 피드백</h1>
      <p className="text-gray-400 text-sm mb-6">
        참가자들의 서비스에 피드백을 남겨주세요. 서비스 URL을 입력하고, 텍스트와 스크린샷으로 의견을 전달할 수 있습니다.
      </p>

      <FeedbackForm onSubmitted={fetchFeedbacks} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          {grouped.length > 0 ? `${grouped.length}개 서비스에 피드백이 등록되었습니다.` : ''}
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        ) : grouped.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-400">아직 등록된 피드백이 없습니다. 첫 번째 피드백을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(group => (
              <div key={group.url} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {group.title !== group.url ? group.title : ''}
                    </h3>
                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline break-all"
                    >
                      {group.url}
                    </a>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 ml-2">
                    {group.feedbacks.length}개 피드백
                  </span>
                </div>

                <div className="space-y-3">
                  {group.feedbacks.map(fb => (
                    <div key={fb.id} className="pl-4 border-l-2 border-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-400">{fb.author_name}</span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
