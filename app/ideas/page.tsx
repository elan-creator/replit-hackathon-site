import IdeaForm from '@/components/IdeaForm';

export default function IdeasPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">아이디어 정리하기</h1>
        <p className="text-gray-400 leading-relaxed">
          워크숍에서 만들고 싶은 것을 자유롭게 적어주세요.
          제출 후 AI가 아이디어를 더 구체화할 수 있도록 질문을 드립니다.
        </p>
      </div>
      <IdeaForm />
    </div>
  );
}
