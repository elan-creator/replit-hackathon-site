import DocsLayout from '@/components/DocsLayout';
import { getNavigation } from '@/lib/docs';

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation();

  return (
    <DocsLayout navigation={navigation}>
      {children}
    </DocsLayout>
  );
}
