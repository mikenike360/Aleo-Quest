'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  type: 'success' | 'celebration' | 'sparkle' | 'flow';
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  onComplete?: () => void;
}

export function ParticleEffect({ 
  type, 
  color = '#3B82F6', 
  intensity = 'medium',
  duration = 2000,
  onComplete 
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const controls = useAnimation();

  const getParticleConfig = () => {
    switch (intensity) {
      case 'low':
        return { count: 20, speed: 1, size: 2 };
      case 'medium':
        return { count: 50, speed: 2, size: 3 };
      case 'high':
        return { count: 100, speed: 3, size: 4 };
      default:
        return { count: 50, speed: 2, size: 3 };
    }
  };

  const createParticle = (x: number, y: number): Particle => {
    const config = getParticleConfig();
    const angle = Math.random() * Math.PI * 2;
    const speed = config.speed + Math.random() * 2;
    
    return {
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      color,
      size: config.size + Math.random() * 2
    };
  };

  const createParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = getParticleConfig();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = [];

    switch (type) {
      case 'success':
        // Burst from center
        for (let i = 0; i < config.count; i++) {
          particlesRef.current.push(createParticle(centerX, centerY));
        }
        break;
      case 'celebration':
        // Multiple bursts
        for (let burst = 0; burst < 3; burst++) {
          setTimeout(() => {
            for (let i = 0; i < config.count / 3; i++) {
              particlesRef.current.push(createParticle(centerX, centerY));
            }
          }, burst * 200);
        }
        break;
      case 'sparkle':
        // Random sparkles across canvas
        for (let i = 0; i < config.count; i++) {
          particlesRef.current.push(createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          ));
        }
        break;
      case 'flow':
        // Flowing particles from left to right
        for (let i = 0; i < config.count; i++) {
          const particle = createParticle(0, Math.random() * canvas.height);
          particle.vx = Math.abs(particle.vx) + 1;
          particlesRef.current.push(particle);
        }
        break;
    }
  };

  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;
      
      // Apply gravity for some effects
      if (type === 'success' || type === 'celebration') {
        particle.vy += 0.1;
      }
      
      return particle.life < particle.maxLife;
    });
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach(particle => {
      const alpha = 1 - (particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const animate = () => {
    updateParticles();
    drawParticles();

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    // Start animation
    controls.start({ opacity: 1 });
    createParticles();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </motion.div>
  );
}

// Convenience components for common effects
export function SuccessParticles({ onComplete }: { onComplete?: () => void }) {
  return (
    <ParticleEffect 
      type="success" 
      color="#10B981" 
      intensity="medium"
      onComplete={onComplete}
    />
  );
}

export function CelebrationParticles({ onComplete }: { onComplete?: () => void }) {
  return (
    <ParticleEffect 
      type="celebration" 
      color="#8B5CF6" 
      intensity="high"
      onComplete={onComplete}
    />
  );
}

export function SparkleEffect({ onComplete }: { onComplete?: () => void }) {
  return (
    <ParticleEffect 
      type="sparkle" 
      color="#EAB308" 
      intensity="low"
      onComplete={onComplete}
    />
  );
}

export function FlowEffect({ onComplete }: { onComplete?: () => void }) {
  return (
    <ParticleEffect 
      type="flow" 
      color="#3B82F6" 
      intensity="medium"
      onComplete={onComplete}
    />
  );
}
