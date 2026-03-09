import pool from '@/lib/db';
import IdeaCard from '@/components/IdeaCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const result = await pool.query('SELECT * FROM ideas ORDER BY created_at DESC');
  const ideas = result.rows;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">아이디어 모아보기</h1>
          <p className="text-gray-400 text-sm">
            {ideas.length > 0
              ? `총 ${ideas.length}개의 아이디어가 등록되었습니다.`
              : '아직 등록된 아이디어가 없습니다.'}
          </p>
        </div>
        <Link
          href="/ideas"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          새 아이디어 작성
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💭</div>
          <p className="text-gray-400">첫 번째 아이디어를 등록해보세요!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
