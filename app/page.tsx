import { redirect } from 'next/navigation';

export default async function Home() {
  redirect(`/docs/${encodeURIComponent('가이드')}/${encodeURIComponent('0-시작하기')}/${encodeURIComponent('커리큘럼')}`);
}
