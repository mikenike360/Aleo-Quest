'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalText, TerminalInput } from '@/components/zkVisuals/TerminalTheme';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { learnSteps, getProgressPercent } from '@/lib/steps';
import { useSoundManager } from '@/lib/audio';

interface Command {
  command: string;
  output: string;
  timestamp: Date;
}

export function InteractiveTerminal() {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const soundManager = useSoundManager();

  const badges = useAppStore((state) => state.badges);
  const completedSteps = useAppStore((state) => state.completedSteps);
  const progressPercent = getProgressPercent(completedSteps);
  const questProgress = Math.round((badges.length / 5) * 100);

  const commands = {
    help: () => `Available commands:
  help          - Show this help message
  ls            - List available sections
  cd <section>  - Navigate to section (home, learn, quest)
  whoami        - Show your progress
  clear         - Clear terminal history
  exit          - Close terminal`,
    
    ls: () => `drwxr-xr-x  home/      main menu    [HOME]
drwxr-xr-x  learn/     5 chapters   [EDUCATIONAL]
drwxr-xr-x  quest/     5 stages     [GAMIFIED]`,
    
    cd: (args: string) => {
      const section = args.trim();
      if (!section) return 'Usage: cd <section>\nAvailable sections: home, learn, quest';
      
      if (['learn', 'quest', 'home'].includes(section)) {
        setTimeout(() => {
          router.push(section === 'home' ? '/' : `/${section}`);
        }, 500);
        return `Navigating to /${section === 'home' ? '' : section}...`;
      }
      
      return `cd: ${section}: No such directory\nAvailable sections: home, learn, quest`;
    },
    
    whoami: () => `User Progress Report:
  Learn Progress: ${progressPercent}% (${completedSteps.length}/${learnSteps.length} chapters)
  Quest Progress: ${questProgress}% (${badges.length}/5 badges earned)
  
  Badges: ${badges.length > 0 ? badges.join(', ') : 'None earned yet'}`,
    
    clear: () => {
      setCommandHistory([]);
      return '';
    },
    
    exit: () => 'Terminal closed.'
  };

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const [command, ...args] = trimmedInput.split(' ');
    const argsString = args.join(' ');

    setIsProcessing(true);

    setTimeout(() => {
      let output = '';
      
      if (command in commands) {
        if (command === 'cd') {
          output = commands.cd(argsString);
        } else {
          const commandFn = commands[command as keyof typeof commands];
          if (commandFn === commands.cd) {
            output = commands.cd(argsString);
          } else {
            output = (commandFn as () => string)();
          }
        }
      } else {
        output = `Command not found: ${command}\nType 'help' for available commands.`;
      }

      const newCommand: Command = {
        command: trimmedInput,
        output,
        timestamp: new Date()
      };

      setCommandHistory(prev => [...prev.slice(-9), newCommand]); // Keep last 10 commands
      setCurrentInput('');
      setIsProcessing(false);
      
      // Play command sound
      soundManager.playCommandSound();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.map(cmd => cmd.command);
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commands[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const commands = commandHistory.map(cmd => cmd.command);
        const newIndex = historyIndex + 1;
        if (newIndex >= commands.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commands[newIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div >
      {/* Section divider */}
      {/* <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
        <div className="font-mono text-xs text-cyan-400 px-4 py-1 border border-cyan-500/30 bg-cyan-500/5 rounded">
          INTERACTIVE_TERMINAL
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      </div> */}

      {/* Welcome message */}
      <div className="space-y-2">
        {/* <TerminalText colorScheme="cyan" variant="accent" className="block">
          Welcome to the Aleo QuestTerminal
        </TerminalText> */}
        <TerminalText colorScheme="cyan" variant="muted" className="block text-xs">
          Type 'help' for available commands
        </TerminalText>
      </div>

      {/* Command history */}
      <AnimatePresence>
        {commandHistory.map((cmd, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1 overflow-x-auto"
          >
            <div className="flex items-start gap-2 break-words">
              <TerminalText colorScheme="cyan" variant="accent">➜</TerminalText>
              <TerminalText colorScheme="cyan" variant="primary" className="break-all">{cmd.command}</TerminalText>
            </div>
            {cmd.output && (
              <div className="ml-4 whitespace-pre-line break-words">
                <TerminalText colorScheme="cyan" variant="muted" className="text-sm break-words">
                  {cmd.output}
                </TerminalText>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Current command input */}
      <div className="flex items-start gap-2">
        <TerminalText colorScheme="cyan" variant="accent">➜</TerminalText>
        <div className="flex-1">
              <TerminalInput
                ref={inputRef}
                value={currentInput}
                onChange={(value) => {
                  setCurrentInput(value);
                  // Play typing sound occasionally
                  if (value.length > 0 && value.length % 3 === 0) {
                    soundManager.playTypingSound();
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={isProcessing ? "Processing..." : "Enter command..."}
                disabled={isProcessing}
                colorScheme="cyan"
                prompt=""
                className="w-full border-0 focus:ring-0"
              />
        </div>
      </div>
    </div>
  );
}
