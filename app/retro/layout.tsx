import DocsLayout from '@/components/DocsLayout';
import { getNavigation } from '@/lib/docs';

export default function RetroLayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation();

  return (
    <DocsLayout navigation={navigation}>
      {children}
    </DocsLayout>
  );
}
