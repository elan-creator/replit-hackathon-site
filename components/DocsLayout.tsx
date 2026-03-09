'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

interface NavItem { slug: string; title: string; }
interface NavSubsection { name: string; items: NavItem[]; }
interface NavSection { name: string; children: NavSubsection[]; }

export default function DocsLayout({ navigation, children }: { navigation: NavSection[]; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar navigation={navigation} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-gray-400">바이브코딩 워크샵</h1>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
