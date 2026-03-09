import Link from 'next/link';

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-gray-950/80 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/ideas" className="text-lg font-bold text-white hover:text-blue-400">
            💡 아이디어 보드
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/ideas" className="text-gray-400 hover:text-white">
              새 아이디어
            </Link>
            <Link href="/ideas/gallery" className="text-gray-400 hover:text-white">
              모아보기
            </Link>
            <Link href="/docs/가이드/0-사전설치/커리큘럼" className="text-gray-400 hover:text-white">
              📚 문서
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
