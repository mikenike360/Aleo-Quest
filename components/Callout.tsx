import { cn } from '@/lib/cn';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    symbol: 'ℹ',
    className: 'border-cyan-500/30 bg-cyan-500/5',
    headerClassName: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    contentClassName: 'text-gray-300',
  },
  warning: {
    symbol: '⚠',
    className: 'border-yellow-500/30 bg-yellow-500/5',
    headerClassName: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    contentClassName: 'text-gray-300',
  },
  success: {
    symbol: '✓',
    className: 'border-green-500/30 bg-green-500/5',
    headerClassName: 'bg-green-500/10 border-green-500/20 text-green-400',
    contentClassName: 'text-gray-300',
  },
  tip: {
    symbol: '💡',
    className: 'border-purple-500/30 bg-purple-500/5',
    headerClassName: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    contentClassName: 'text-gray-300',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];

  return (
    <div className={cn('my-6 overflow-hidden rounded-xl border backdrop-blur-sm', config.className)}>
      {title && (
        <div className={cn('border-b px-4 py-2.5', config.headerClassName)}>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span>{config.symbol}</span>
            <span>{title.toLowerCase()}</span>
          </div>
        </div>
      )}
      <div className={cn('p-4 text-sm leading-relaxed', config.contentClassName)}>
        {children}
      </div>
    </div>
  );
}

