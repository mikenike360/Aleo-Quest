import { cn } from '@/lib/cn';

interface DiagramProps {
  children: React.ReactNode;
  className?: string;
  caption?: string;
  title?: string;
}

export function Diagram({ children, className, caption, title }: DiagramProps) {
  return (
    <figure className={cn('my-8', className)}>
      <div className="overflow-hidden rounded-xl border border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-cyan-500/5">
        {title && (
          <div className="border-b border-cyan-500/20 bg-gray-800/90 px-5 py-3">
            <div className="font-mono text-xs text-cyan-400">
              {title}
            </div>
          </div>
        )}
        <div className="flex items-center justify-center p-8">
          {children}
        </div>
        {caption && (
          <div className="border-t border-cyan-500/20 bg-gray-800/50 px-5 py-3">
            <p className="text-center font-mono text-xs text-gray-400">
              <span className="text-gray-600">&gt;</span> {caption}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}

