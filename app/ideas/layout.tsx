import DocsLayout from '@/components/DocsLayout';
import { getNavigation } from '@/lib/docs';

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation();

  return (
    <DocsLayout navigation={navigation}>
      {children}
    </DocsLayout>
  );
}
