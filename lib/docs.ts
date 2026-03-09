import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface DocItem {
  slug: string;
  title: string;
  content: string;
  section: string;
  subsection: string;
  filename: string;
}

export interface NavSection {
  name: string;
  children: NavSubsection[];
}

export interface NavSubsection {
  name: string;
  items: { slug: string; title: string }[];
}

function walk(dir: string, base: string = ''): DocItem[] {
  const items: DocItem[] = [];
  if (!fs.existsSync(dir)) return items;
  
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      items.push(...walk(fullPath, relPath));
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const parts = relPath.replace(/\.md$/, '').split('/');
      const section = parts[0] || '';
      const subsection = parts.length > 2 ? parts[1] : '';
      const filename = parts[parts.length - 1];
      const slug = parts.join('/');
      
      // Extract title from first H1 or filename
      const h1Match = content.match(/^#\s+(.+)$/m);
      const title = h1Match ? h1Match[1] : filename;
      
      items.push({ slug, title, content, section, subsection, filename });
    }
  }
  return items;
}

export function getAllDocs(): DocItem[] {
  return walk(CONTENT_DIR);
}

export function getDocBySlug(slug: string): DocItem | undefined {
  const docs = getAllDocs();
  return docs.find(d => d.slug === slug);
}

export function getNavigation(): NavSection[] {
  const docs = getAllDocs();
  const sections: Map<string, Map<string, { slug: string; title: string }[]>> = new Map();
  
  const sectionOrder = ['가이드', 'references'];
  const subsectionOrder: Record<string, string[]> = {
    '가이드': ['0-사전설치', '1-스킬개념-실습', '2-바이브코딩-기초', '3-연동-설정가이드', '4-스킬만들기-실습'],
    'references': [''],
  };

  for (const doc of docs) {
    const sec = doc.section;
    const sub = doc.subsection;
    if (!sections.has(sec)) sections.set(sec, new Map());
    const subs = sections.get(sec)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push({ slug: doc.slug, title: doc.title });
  }

  const nav: NavSection[] = [];
  for (const secName of sectionOrder) {
    const subs = sections.get(secName);
    if (!subs) continue;
    
    const children: NavSubsection[] = [];
    const order = subsectionOrder[secName] || Array.from(subs.keys());
    
    for (const subName of order) {
      const items = subs.get(subName);
      if (!items) continue;
      // Sort items: index first, then alphabetically
      items.sort((a, b) => {
        if (a.slug.endsWith('/index')) return -1;
        if (b.slug.endsWith('/index')) return 1;
        return a.slug.localeCompare(b.slug);
      });
      children.push({ name: subName, items });
    }
    
    nav.push({ name: secName, children });
  }
  
  return nav;
}

export function getAllSlugs(): string[] {
  return getAllDocs().map(d => d.slug);
}
