'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
    const init: Record<string, boolean> = {};
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
    'daily-feedback': '📝 daily-feedback',
    'references': '📖 references',
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto z-40 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-800">
          <Link href="/docs/가이드/0-사전설치/강사소개" className="text-lg font-bold text-white hover:text-blue-400">
            🚀 워크샵 문서
          </Link>
        </div>
        <div className="p-3 border-b border-gray-800">
          <Link
            href="/ideas"
            onClick={onClose}
            className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:text-white font-medium text-sm"
          >
            💡 아이디어 보드
          </Link>
        </div>
        <nav className="p-3 text-sm">
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
