import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Home } from 'lucide-react';
import '../src/assets/css/globals.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aleo Quest',
  description: 'Learn, See, and Do Zero-Knowledge with Aleo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white antialiased`}>
        {/* Terminal Navigation */}
        <nav className="sticky top-0 z-50 border-b border-cyan-500/30 bg-gray-900/95 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Home / Prompt */}
              <Link href="/" className="flex items-center gap-2 font-mono">
                <span className="text-green-400">➜</span>
                <span className="text-cyan-400">~</span>
                <span className="hidden sm:inline text-gray-600">/aleo-quest</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link
                  href="/learn"
                  className="group relative px-3 py-1.5 font-mono text-sm transition-colors hover:text-cyan-400"
                >
                  <span className="text-gray-600">./</span>
                  <span>learn</span>
                  <span className="absolute inset-x-0 -bottom-1 h-px scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100" />
                </Link>
                <span className="text-gray-700">|</span>
                <Link
                  href="/quest"
                  className="group relative px-3 py-1.5 font-mono text-sm transition-colors hover:text-pink-400"
                >
                  <span className="text-gray-600">./</span>
                  <span>quest</span>
                  <span className="absolute inset-x-0 -bottom-1 h-px scale-x-0 bg-pink-400 transition-transform group-hover:scale-x-100" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Terminal Footer */}
        <footer className="border-t border-cyan-500/30 bg-gray-900/80 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="font-mono text-xs text-gray-400">
                <span className="text-gray-600">&gt;</span> © 2025 Aleo Quest
                <span className="mx-2 text-gray-700">|</span>
                <span className="text-gray-500">Built with privacy in mind</span>
              </p>
              <div className="flex gap-4 font-mono text-xs">
                <a
                  href="https://aleo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <span className="text-gray-600">[</span>aleo.org<span className="text-gray-600">]</span>
                </a>
                <a
                  href="https://developer.aleo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <span className="text-gray-600">[</span>docs<span className="text-gray-600">]</span>
                </a>
                <a
                  href="https://github.com/AleoHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <span className="text-gray-600">[</span>github<span className="text-gray-600">]</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

