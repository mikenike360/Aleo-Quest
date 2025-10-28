'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

// Terminal color constants for each stage
export const TERMINAL_COLORS = {
  cyan: {
    primary: '#06B6D4',    // cyan-500
    secondary: '#0891B2',  // cyan-600
    accent: '#22D3EE',     // cyan-400
    muted: '#67E8F9',      // cyan-300
    background: '#0C4A6E', // cyan-900
  },
  green: {
    primary: '#10B981',    // emerald-500
    secondary: '#059669',  // emerald-600
    accent: '#34D399',     // emerald-400
    muted: '#6EE7B7',      // emerald-300
    background: '#064E3B', // emerald-900
  },
  purple: {
    primary: '#8B5CF6',    // violet-500
    secondary: '#7C3AED',  // violet-600
    accent: '#A78BFA',     // violet-400
    muted: '#C4B5FD',      // violet-300
    background: '#4C1D95', // violet-900
  },
  yellow: {
    primary: '#F59E0B',    // amber-500
    secondary: '#D97706',  // amber-600
    accent: '#FBBF24',     // amber-400
    muted: '#FCD34D',      // amber-300
    background: '#78350F', // amber-900
  },
  mixed: {
    primary: '#06B6D4',    // cyan
    secondary: '#10B981',  // green
    accent: '#8B5CF6',     // purple
    muted: '#F59E0B',      // yellow
    background: '#1F2937', // gray-800
  }
} as const;

export type TerminalColorScheme = keyof typeof TERMINAL_COLORS;

interface TerminalPanelProps {
  children: ReactNode;
  colorScheme?: TerminalColorScheme;
  className?: string;
  showScanlines?: boolean;
  title?: string;
}

export function TerminalPanel({ 
  children, 
  colorScheme = 'cyan', 
  className = '', 
  showScanlines = true,
  title 
}: TerminalPanelProps) {
  const colors = TERMINAL_COLORS[colorScheme];
  
  return (
    <div className={`relative ${className}`}>
      {/* Main panel */}
      <div 
        className="border-2 rounded-lg p-6 bg-black"
        style={{ 
          borderColor: colors.primary,
          backgroundColor: '#000000'
        }}
      >
        {/* Title */}
        {title && (
          <div className="mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>
            <div className="font-mono text-sm font-bold" style={{ color: colors.accent }}>
              {title}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Scanlines effect */}
        {showScanlines && (
          <div 
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] rounded-lg"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colors.primary} 2px, ${colors.primary} 4px)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  colorScheme?: TerminalColorScheme;
  prompt?: string;
  className?: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder = '', 
  disabled = false,
  colorScheme = 'cyan',
  prompt = '>',
  className = ''
}, ref) => {
  const colors = TERMINAL_COLORS[colorScheme];
  
  return (
    <div className="relative">
      <div className="flex items-center">
        <span className="font-mono text-sm mr-2" style={{ color: colors.accent }}>
          {prompt}
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            flex-1 bg-transparent border-none outline-none font-mono text-sm
            placeholder-gray-500
            focus:outline-none focus:ring-0 focus:border-none
            ${disabled ? 'text-gray-500' : ''}
            ${className}
          `}
          style={{ 
            color: disabled ? '#6B7280' : colors.primary,
            caretColor: colors.accent
          }}
        />
        {/* Terminal cursor */}
        {/* {!disabled && (
          <motion.span
            className="font-mono text-sm"
            style={{ color: colors.accent }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            _
          </motion.span>
        )} */}
      </div>
    </div>
  );
});

interface TerminalButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  colorScheme?: TerminalColorScheme;
  command?: string;
  className?: string;
}

export function TerminalButton({ 
  children, 
  onClick, 
  disabled = false,
  colorScheme = 'cyan',
  command,
  className = ''
}: TerminalButtonProps) {
  const colors = TERMINAL_COLORS[colorScheme];
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-mono text-sm font-bold px-4 py-2 rounded border-2 transition-all
        ${disabled 
          ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
          : 'cursor-pointer hover:brightness-110 active:brightness-90'
        }
        ${className}
      `}
      style={{
        borderColor: disabled ? '#4B5563' : colors.primary,
        color: disabled ? '#6B7280' : colors.primary,
        backgroundColor: disabled ? '#1F2937' : 'transparent'
      }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {command ? `$ ${command}` : children}
    </motion.button>
  );
}

interface TerminalTextProps {
  children: ReactNode;
  colorScheme?: TerminalColorScheme;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'error';
  className?: string;
}

export function TerminalText({ 
  children, 
  colorScheme = 'cyan',
  variant = 'primary',
  className = ''
}: TerminalTextProps) {
  const colors = TERMINAL_COLORS[colorScheme];
  
  const getColor = () => {
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'accent': return colors.accent;
      case 'muted': return colors.muted;
      case 'success': return '#10B981'; // green-500
      case 'error': return '#EF4444';   // red-500
      default: return colors.primary;
    }
  };
  
  return (
    <span 
      className={`font-mono ${className}`}
      style={{ color: getColor() }}
    >
      {children}
    </span>
  );
}

interface TerminalStatusProps {
  status: 'ok' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export function TerminalStatus({ status, children, className = '' }: TerminalStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'ok': return '#10B981';     // green-500
      case 'error': return '#EF4444';  // red-500
      case 'warning': return '#F59E0B'; // amber-500
      case 'info': return '#06B6D4';   // cyan-500
      default: return '#6B7280';       // gray-500
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'ok': return '[OK]';
      case 'error': return '[ERROR]';
      case 'warning': return '[WARN]';
      case 'info': return '[INFO]';
      default: return '[STATUS]';
    }
  };
  
  return (
    <div className={`font-mono text-sm ${className}`}>
      <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
      <span className="text-gray-400 ml-2">{children}</span>
    </div>
  );
}

interface TerminalProgressProps {
  value: number;
  max: number;
  colorScheme?: TerminalColorScheme;
  className?: string;
}

export function TerminalProgress({ value, max, colorScheme = 'cyan', className = '' }: TerminalProgressProps) {
  const colors = TERMINAL_COLORS[colorScheme];
  const percentage = Math.round((value / max) * 100);
  const filledBars = Math.round((value / max) * 10);
  const emptyBars = 10 - filledBars;
  
  return (
    <div className={`font-mono text-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <span style={{ color: colors.accent }}>[</span>
        <span style={{ color: colors.primary }}>
          {'='.repeat(filledBars)}
        </span>
        <span style={{ color: colors.muted }}>
          {'-'.repeat(emptyBars)}
        </span>
        <span style={{ color: colors.accent }}>]</span>
        <span style={{ color: colors.primary }}>{percentage}%</span>
      </div>
    </div>
  );
}

// ASCII Art Components
export const ASCII_ART = {
  vault: `┌─────────┐
│  [###]  │
│   [X]   │
└─────────┘`,
  lock: `[LOCKED]`,
  unlock: `[UNLOCKED]`,
  coin: `[$]`,
  wallet: `[WALLET]`,
  merchant: `[MERCHANT]`,
  arrow: `-->`,
  circuit: `┌─┐   ┌─┐
│ │──>│ │
└─┘   └─┘`,
  gate: `=== GATE ===`,
  success: `[SUCCESS]`,
  error: `[ERROR]`,
  ok: `[OK]`,
  loading: ['[/]', '[-]', '[\\]', '[|]']
} as const;
