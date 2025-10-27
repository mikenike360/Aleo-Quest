'use client';

import Link from 'next/link';

interface TerminalBreadcrumbProps {
  currentPage: string;
  colorScheme?: 'cyan' | 'green';
}

export function TerminalBreadcrumb({ currentPage, colorScheme = 'green' }: TerminalBreadcrumbProps) {
  const colorClass = colorScheme === 'cyan' ? 'text-cyan-400 hover:text-cyan-300' : 'text-green-400 hover:text-green-300';
  
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <Link href="/" className={`${colorClass} transition-colors`}>
        home
      </Link>
      <span className="text-gray-600">/</span>
      <span className="text-gray-400">{currentPage}</span>
    </div>
  );
}
