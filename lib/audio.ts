'use client';

import { useAppStore } from './store';

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private ambientSound: HTMLAudioElement | null = null;
  private volume: number = 0.3;
  private muted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  private initializeSounds() {
    if (this.isInitialized) return;
    
    const soundFiles = [
      'vault-ambient.mp3',
      'proof-ambient.mp3', 
      'choice-ambient.mp3',
      'market-ambient.mp3',
      'final-gate-ambient.mp3',
      'success.mp3',
      'level-up.mp3',
      'discovery.mp3',
      'error.mp3',
      'command.mp3',
      'click.mp3',
      'hover.mp3',
      'transition.mp3',
      'typing.mp3'
    ];

    soundFiles.forEach(filename => {
      const audio = new Audio(`/aleo-quest-images/music/${filename}`);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(filename.replace('.mp3', ''), audio);
    });

    this.isInitialized = true;
  }

  private getSound(name: string): HTMLAudioElement | null {
    if (!this.isInitialized) {
      this.initializeSounds();
    }
    return this.sounds.get(name) || null;
  }

  playSound(name: string, volume?: number): void {
    if (this.muted || typeof window === 'undefined') return;
    
    const sound = this.getSound(name);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = volume !== undefined ? volume : this.volume;
      sound.play().catch(error => {
        console.log(`Sound play failed for ${name}:`, error);
      });
    }
  }

  playSoundAsync(name: string, volume?: number): Promise<void> {
    if (this.muted || typeof window === 'undefined') return Promise.resolve();
    
    const sound = this.getSound(name);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = volume !== undefined ? volume : this.volume;
      return sound.play().catch(error => {
        console.log(`Sound play failed for ${name}:`, error);
      });
    }
    return Promise.resolve();
  }

  setAmbient(name: string): void {
    if (typeof window === 'undefined') return;
    
    // Stop current ambient sound
    this.stopAmbient();
    
    // Don't start if muted
    if (this.muted) return;
    
    const sound = this.getSound(name);
    if (sound) {
      sound.loop = true;
      sound.volume = this.volume * 0.5; // Ambient sounds are quieter
      sound.play().catch(error => {
        console.log(`Ambient sound play failed for ${name}:`, error);
      });
      this.ambientSound = sound;
    }
  }

  stopAmbient(): void {
    if (this.ambientSound) {
      this.ambientSound.pause();
      this.ambientSound.currentTime = 0;
      this.ambientSound = null;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update all sounds
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
    
    // Update ambient sound
    if (this.ambientSound) {
      this.ambientSound.volume = this.volume * 0.5;
    }
  }

  toggleMute(): void {
    this.muted = !this.muted;
    
    if (this.muted) {
      this.stopAmbient();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    
    if (muted) {
      this.stopAmbient();
    }
  }

  getVolume(): number {
    return this.volume;
  }

  isMuted(): boolean {
    return this.muted;
  }

  // Specific sound methods for different actions
  playTypingSound(): void {
    this.playSound('typing', this.volume * 0.2);
  }

  playCommandSound(): void {
    this.playSound('command', this.volume * 0.4);
  }

  playSuccessSound(): void {
    this.playSound('success', this.volume * 0.6);
  }

  playLevelUpSound(): void {
    this.playSound('level-up', this.volume * 0.7);
  }

  playDiscoverySound(): void {
    this.playSound('discovery', this.volume * 0.5);
  }

  playErrorSound(): void {
    this.playSound('error', this.volume * 0.6);
  }

  playClickSound(): void {
    this.playSound('click', this.volume * 0.3);
  }

  playHoverSound(): void {
    this.playSound('hover', this.volume * 0.1);
  }

  playTransitionSound(): void {
    this.playSound('transition', this.volume * 0.5);
  }

  // Quest stage ambient sounds
  playQuestAmbient(stage: string): void {
    const ambientMap: Record<string, string> = {
      'locked-vault': 'vault-ambient',
      'truth-teller': 'proof-ambient',
      'hidden-key': 'choice-ambient',
      'private-marketplace': 'market-ambient',
      'final-gate': 'final-gate-ambient',
      'completed': 'vault-ambient' // Reuse vault ambient for completion
    };

    const ambientName = ambientMap[stage];
    if (ambientName) {
      this.setAmbient(ambientName);
    }
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Hook for using sound manager with React
export function useSoundManager() {
  const isAudioMuted = useAppStore((state) => state.isAudioMuted);
  const setAudioMuted = useAppStore((state) => state.setAudioMuted);

  // Sync with store - update SoundManager when store changes
  React.useEffect(() => {
    soundManager.setMuted(isAudioMuted);
  }, [isAudioMuted]);

  // Sync with store - update store when SoundManager changes
  React.useEffect(() => {
    if (soundManager.isMuted() !== isAudioMuted) {
      setAudioMuted(soundManager.isMuted());
    }
  }, []);

  const toggleMute = () => {
    const newMuted = !isAudioMuted;
    setAudioMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  const setVolume = (volume: number) => {
    soundManager.setVolume(volume);
  };

  return {
    playSound: soundManager.playSound.bind(soundManager),
    playSoundAsync: soundManager.playSoundAsync.bind(soundManager),
    playTypingSound: soundManager.playTypingSound.bind(soundManager),
    playCommandSound: soundManager.playCommandSound.bind(soundManager),
    playSuccessSound: soundManager.playSuccessSound.bind(soundManager),
    playLevelUpSound: soundManager.playLevelUpSound.bind(soundManager),
    playDiscoverySound: soundManager.playDiscoverySound.bind(soundManager),
    playErrorSound: soundManager.playErrorSound.bind(soundManager),
    playClickSound: soundManager.playClickSound.bind(soundManager),
    playHoverSound: soundManager.playHoverSound.bind(soundManager),
    playTransitionSound: soundManager.playTransitionSound.bind(soundManager),
    playQuestAmbient: soundManager.playQuestAmbient.bind(soundManager),
    setAmbient: soundManager.setAmbient.bind(soundManager),
    stopAmbient: soundManager.stopAmbient.bind(soundManager),
    setVolume,
    toggleMute,
    volume: soundManager.getVolume(),
    muted: isAudioMuted
  };
}

// Import React for the hook
import React from 'react';
