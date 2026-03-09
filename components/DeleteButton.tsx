'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  onDelete: (password: string) => Promise<void>;
  label?: string;
}

export default function DeleteButton({ onDelete, label = '삭제' }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setError('');
    setDeleting(true);
    try {
      await onDelete(password);
      setShowConfirm(false);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true); }}
        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        title={label}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <input
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleDelete(); }}
        placeholder="비밀번호"
        autoFocus
        className="w-24 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
      />
      <button
        onClick={handleDelete}
        disabled={deleting || !password}
        className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
      >
        {deleting ? '...' : '확인'}
      </button>
      <button
        onClick={() => { setShowConfirm(false); setPassword(''); setError(''); }}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
      >
        취소
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
