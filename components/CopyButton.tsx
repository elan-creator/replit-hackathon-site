'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        copied
          ? 'bg-green-600 text-white'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
      }`}
    >
      {copied ? '복사됨!' : '복사하기'}
    </button>
  );
}
