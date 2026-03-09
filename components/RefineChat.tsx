'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Idea {
  id: number;
  author_name: string;
  idea_text: string;
  refinement_q1: string | null;
  refinement_a1: string | null;
  refinement_q2: string | null;
  refinement_a2: string | null;
}

export default function RefineChat({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedSteps, setCompletedSteps] = useState<
    { question: string; answer: string }[]
  >([]);

  useEffect(() => {
    if (idea.refinement_q1 && idea.refinement_a1) {
      setCompletedSteps([{ question: idea.refinement_q1, answer: idea.refinement_a1 }]);
      if (idea.refinement_q2 && idea.refinement_a2) {
        setCompletedSteps([
          { question: idea.refinement_q1, answer: idea.refinement_a1 },
          { question: idea.refinement_q2, answer: idea.refinement_a2 },
        ]);
        setCurrentStep(3);
        setIsLoading(false);
        return;
      }
      setCurrentStep(2);
    }
    fetchQuestion(idea.refinement_q1 ? 2 : 1);
  }, []);

  const fetchQuestion = async (step: number) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/ideas/${idea.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step }),
      });
      if (!res.ok) throw new Error('Failed to generate question');
      const data = await res.json();
      setCurrentQuestion(data.question);
    } catch {
      setError('질문을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/ideas/${idea.id}/refine`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          question: currentQuestion,
          answer: answer.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to save answer');

      setCompletedSteps((prev) => [
        ...prev,
        { question: currentQuestion, answer: answer.trim() },
      ]);
      setAnswer('');

      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
        fetchQuestion(currentStep + 1);
      } else {
        setCurrentStep(3);
      }
    } catch {
      setError('답변 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">{idea.author_name}님의 아이디어</p>
        <p className="text-gray-200 whitespace-pre-wrap">{idea.idea_text}</p>
      </div>

      <div className="flex gap-2 mb-4">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= completedSteps.length
                ? 'bg-blue-500'
                : s === currentStep && currentStep < 3
                ? 'bg-blue-500/40'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {completedSteps.map((step, i) => (
        <div key={i} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">
              Q
            </div>
            <div className="p-3 bg-gray-800 rounded-lg flex-1">
              <p className="text-gray-200 text-sm">{step.question}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="p-3 bg-blue-600/10 border border-blue-800/30 rounded-lg max-w-[80%]">
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{step.answer}</p>
            </div>
          </div>
        </div>
      ))}

      {currentStep <= 2 && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">
              Q
            </div>
            <div className="p-3 bg-gray-800 rounded-lg flex-1">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-blue-400 rounded-full animate-spin" />
                  질문을 생성하고 있어요...
                </div>
              ) : (
                <p className="text-gray-200 text-sm">{currentQuestion}</p>
              )}
            </div>
          </div>

          {!isLoading && (
            <div className="pl-11">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="답변을 입력하세요..."
                rows={3}
                maxLength={5000}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{answer.length}/5000</p>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !answer.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isSubmitting ? '저장 중...' : '답변 제출'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center space-y-4 pt-4">
          <div className="text-4xl">🎉</div>
          <p className="text-gray-200 font-medium">아이디어 다듬기가 완료되었습니다!</p>
          <p className="text-gray-400 text-sm">다른 참석자들의 아이디어도 확인해보세요.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/ideas/gallery')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              아이디어 모아보기
            </button>
            <button
              onClick={() => router.push('/ideas')}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700"
            >
              새 아이디어 작성
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
