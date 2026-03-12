'use client';

import IdeaForm from '@/components/IdeaForm';
import Link from 'next/link';
import { useCohort } from '@/contexts/CohortContext';

const galleryExamples = [
  {
    title: 'Journey Mapper',
    description: '제품 & 디자인 팀을 위한 고객 여정 맵핑 도구. 사용자 경험의 각 단계를 시각적으로 설계하고 팀과 공유할 수 있습니다.',
    category: '제품 & 디자인',
    url: 'https://replit.com/gallery/work/product-and-design/journey-mapper',
  },
  {
    title: 'CRM Tracker',
    description: '간단하고 효과적인 고객 관계 관리 도구. 고객 정보, 상담 이력, 거래 현황을 한 곳에서 추적할 수 있습니다.',
    category: '마케팅 & 영업',
    url: 'https://replit.com/gallery/work/marketing-and-sales/crm',
  },
  {
    title: 'LunchVote AI',
    description: '동료들과 점심 메뉴를 투표로 정하는 앱. AI가 주변 맛집을 추천하고 팀원들이 투표해서 결정합니다.',
    category: '생산성',
    url: 'https://replit.com/gallery/life/productivity/lunchvote-ai',
  },
  {
    title: 'Course Platform',
    description: 'Notion 기반 온라인 학습 플랫폼. 무료/유료 강의 모듈을 제공하고, 사용자 접근 권한과 학습 진도를 관리합니다.',
    category: '교육 & 운영',
    url: 'https://replit.com/gallery/work/operations/course-platform',
  },
  {
    title: 'NutriPlan',
    description: '사진으로 음식 칼로리를 자동 인식하는 맞춤형 식단 관리 앱. 식사를 촬영하면 AI가 칼로리를 계산하고 자동 기록합니다.',
    category: '건강 & 피트니스',
    url: 'https://replit.com/gallery/life/health-and-fitness/nutriplan',
  },
];

export default function IdeasPage() {
  const { selectedCohortId } = useCohort();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">아이디어 정리하기</h1>
        <p className="text-gray-400 leading-relaxed">
          워크숍에서 만들고 싶은 것을 자유롭게 적어주세요.
          제출 후 AI가 아이디어를 더 구체화할 수 있도록 질문을 드립니다.
        </p>
      </div>

      <IdeaForm cohortId={selectedCohortId} />

      <div className="mt-16 pt-8 border-t border-gray-800">
        <h2 className="text-xl font-bold text-white mb-2">이런 것도 만들 수 있어요</h2>
        <p className="text-gray-500 text-sm mb-6">
          Replit 갤러리에서 가져온 실제 프로젝트 예시입니다. 영감을 얻어보세요!
        </p>
        <div className="space-y-3">
          {galleryExamples.map((example) => (
            <Link
              key={example.url}
              href={example.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-200 group-hover:text-white text-sm">
                      {example.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
                      {example.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {example.description}
                  </p>
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 text-xs flex-shrink-0 mt-1">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
