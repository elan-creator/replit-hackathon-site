import { notFound } from 'next/navigation';
import { getDocBySlug, getNavigation, getAllSlugs } from '@/lib/docs';
import DocsLayout from '@/components/DocsLayout';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(slug => ({ slug: slug.split('/') }));
}

async function markdownToHtml(md: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(md);
  return result.toString();
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugStr = slug.map(s => decodeURIComponent(s)).join('/');
  const doc = getDocBySlug(slugStr);
  if (!doc) notFound();

  const navigation = getNavigation();
  const htmlContent = await markdownToHtml(doc.content);

  return (
    <DocsLayout navigation={navigation}>
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </DocsLayout>
  );
}
