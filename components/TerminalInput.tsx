'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalInputProps {
  prompt?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  minLength?: number;
  disabled?: boolean;
}

export function TerminalInput({ 
  prompt = '$',
  placeholder = 'Type here...',
  onSubmit,
  minLength = 0,
  disabled = false
}: TerminalInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= minLength && !disabled) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-green-400">{prompt}</span>
        <div className="flex-1 relative">
          {/* Input container with terminal styling */}
          <div className={`relative rounded-lg border transition-all duration-200 ${
            focused 
              ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-transparent text-cyan-400 placeholder-gray-600 outline-none border-none caret-cyan-400 px-4 py-3 rounded-lg"
              style={{ fontFamily: 'inherit' }}
            />
            
            {/* Blinking cursor when not focused and empty */}
            {!focused && value.length === 0 && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono"
              >
                |
              </motion.span>
            )}
            
            {/* Character counter */}
            {value.length > 0 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {value.length}{minLength > 0 ? `/${minLength}` : ''}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Validation message */}
      {value.length > 0 && value.length < minLength && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2"
        >
          <div className="font-mono text-xs text-yellow-400">
            <span className="text-gray-600">&gt;</span> Need at least {minLength} characters ({minLength - value.length} more)
          </div>
        </motion.div>
      )}
      
      {/* Success indicator */}
      {value.length >= minLength && minLength > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2"
        >
          <div className="font-mono text-xs text-green-400">
            <span className="text-gray-600">&gt;</span> ✓ Secret phrase accepted
          </div>
        </motion.div>
      )}
    </form>
  );
}

