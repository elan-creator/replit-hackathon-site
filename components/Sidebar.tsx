'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CohortSelector from './CohortSelector';

interface NavItem {
  slug: string;
  title: string;
}

interface NavSubsection {
  name: string;
  items: NavItem[];
}

interface NavSection {
  name: string;
  children: NavSubsection[];
}

export default function Sidebar({ navigation, isOpen, onClose }: { navigation: NavSection[]; isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { ideas: true, activity: true };
    for (const sec of navigation) {
      init[sec.name] = true;
      for (const sub of sec.children) {
        if (sub.name) init[`${sec.name}/${sub.name}`] = true;
      }
    }
    return init;
  });

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const sectionLabels: Record<string, string> = {
    '가이드': '📚 가이드',
    'references': '📖 references',
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto z-40 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-800 space-y-3">
          <Link href="/docs/가이드/0-시작하기/주최사-소개" className="text-lg font-bold text-white hover:text-blue-400">
            🚀 워크샵 문서
          </Link>
          <CohortSelector />
        </div>
        <nav className="p-3 text-sm">
          {[
            {
              key: 'ideas',
              label: '💡 아이디어 보드',
              items: [
                { href: '/ideas', label: '새 아이디어 작성' },
                { href: '/ideas/gallery', label: '모아보기' },
              ],
            },
            {
              key: 'activity',
              label: '📝 참가자 활동',
              items: [
                { href: '/survey', label: '사전 설문' },
                { href: '/feedback', label: '서비스 피드백' },
                { href: '/retro', label: '일일 회고' },
              ],
            },
          ].map(section => (
            <div key={section.key} className="mb-2">
              <button
                onClick={() => toggle(section.key)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-gray-300 hover:text-white font-medium"
              >
                <span>{section.label}</span>
                <span className="text-xs">{expanded[section.key] ? '▼' : '▶'}</span>
              </button>
              {expanded[section.key] && (
                <div className="ml-4">
                  {section.items.map(item => {
                    const isActive = decodeURIComponent(pathname) === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`block px-2 py-1 rounded text-xs ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {navigation.map(section => (
            <div key={section.name} className="mb-2">
              <button
                onClick={() => toggle(section.name)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-gray-300 hover:text-white font-medium"
              >
                <span>{sectionLabels[section.name] || section.name}</span>
                <span className="text-xs">{expanded[section.name] ? '▼' : '▶'}</span>
              </button>
              {expanded[section.name] && (
                <div className="ml-2">
                  {section.children.map(sub => (
                    <div key={sub.name || '_root'} className="mb-1">
                      {sub.name && (
                        <button
                          onClick={() => toggle(`${section.name}/${sub.name}`)}
                          className="w-full flex items-center justify-between px-2 py-1 text-gray-400 hover:text-white text-xs font-medium"
                        >
                          <span>{sub.name}</span>
                          <span>{expanded[`${section.name}/${sub.name}`] ? '▼' : '▶'}</span>
                        </button>
                      )}
                      {(sub.name === '' || expanded[`${section.name}/${sub.name}`]) && (
                        <div className="ml-2">
                          {sub.items.map(item => {
                            const href = `/docs/${item.slug}`;
                            const isActive = decodeURIComponent(pathname) === href;
                            return (
                              <Link
                                key={item.slug}
                                href={href}
                                onClick={onClose}
                                className={`block px-2 py-1 rounded text-xs ${
                                  isActive
                                    ? 'bg-blue-600/20 text-blue-400 font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                              >
                                {item.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
