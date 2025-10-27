'use client';

import { useEffect, useRef } from 'react';

interface TerminalScrollProps {
  children: React.ReactNode;
  autoScroll?: boolean;
}

export function TerminalScroll({ children, autoScroll = true }: TerminalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      // Use requestAnimationFrame to prevent layout thrashing
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [children, autoScroll]);

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto overflow-x-hidden h-[70vh] max-h-[600px] terminal-text"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(99, 102, 241, 0.3) transparent',
        // Prevent layout shifts on mobile
        contain: 'layout style'
      }}
    >
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
}

