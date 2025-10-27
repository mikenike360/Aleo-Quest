'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Application, Container, Graphics, ParticleContainer, Texture, Sprite } from 'pixi.js';
import { PARTICLE_CONFIGS, EFFECT_COLORS } from './PhysicsConfig';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

interface PixiParticleSystemProps {
  width: number;
  height: number;
  type: 'sparkle' | 'energyBeam' | 'coinTrail' | 'magicalAura' | 'explosion';
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  autoStart?: boolean;
  onComplete?: () => void;
}

export interface PixiParticleSystemRef {
  emit: (x: number, y: number, count?: number) => void;
  stop: () => void;
  start: () => void;
  setPosition: (x: number, y: number) => void;
  setColor: (color: string) => void;
}

export const PixiParticleSystem = forwardRef<PixiParticleSystemRef, PixiParticleSystemProps>(
  ({ width, height, type, color = '#3B82F6', intensity = 'medium', autoStart = true, onComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<Application | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const containerRef = useRef<Container | null>(null);
    const isActiveRef = useRef(false);
    const lastEmitTimeRef = useRef(0);

    const config = PARTICLE_CONFIGS[type];
    const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;

    // Convert hex color to number
    const colorToNumber = (hex: string) => {
      return parseInt(hex.replace('#', ''), 16);
    };

    // Create particle texture
    const createParticleTexture = (app: Application) => {
      const graphics = new Graphics();
      graphics.circle(0, 0, 2);
      graphics.fill(0xFFFFFF);
      return app.renderer.generateTexture(graphics);
    };

    // Initialize PixiJS application
    useEffect(() => {
      if (!canvasRef.current) return;

      const app = new Application();
      
      app.init({
        canvas: canvasRef.current,
        width,
        height,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      }).then(() => {
        appRef.current = app;
        
        // Create particle container
        const container = new Container();
        container.width = width;
        container.height = height;
        app.stage.addChild(container);
        containerRef.current = container;

        // Create particle texture
        const particleTexture = createParticleTexture(app);
        
        // Animation loop
        const animate = () => {
          if (!isActiveRef.current) return;
          
          const now = Date.now();
          const deltaTime = now - lastEmitTimeRef.current;
          
          // Emit particles based on emission rate
          if (deltaTime >= 1000 / (config.emissionRate * intensityMultiplier)) {
            emitParticles(width / 2, height / 2, Math.floor(config.emissionRate * intensityMultiplier * deltaTime / 1000));
            lastEmitTimeRef.current = now;
          }
          
          // Update existing particles
          updateParticles(app, particleTexture);
          
          requestAnimationFrame(animate);
        };

        if (autoStart) {
          isActiveRef.current = true;
          lastEmitTimeRef.current = Date.now();
          animate();
        }
      });

      return () => {
        if (appRef.current) {
          appRef.current.destroy(true);
        }
      };
    }, [width, height, type, intensity, autoStart]);

    // Emit particles at specific position
    const emitParticles = (x: number, y: number, count: number = 1) => {
      if (!containerRef.current) return;

      for (let i = 0; i < count; i++) {
        const particle: Particle = {
          x,
          y,
          vx: (Math.random() - 0.5) * config.startSpeed[1] * 2,
          vy: (Math.random() - 0.5) * config.startSpeed[1] * 2,
          life: 0,
          maxLife: config.lifetime + Math.random() * 500,
          size: 2 + Math.random() * 3,
          color: colorToNumber(color),
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2
        };

        // Adjust velocity based on particle type
        switch (type) {
          case 'sparkle':
            particle.vx = (Math.random() - 0.5) * 200;
            particle.vy = (Math.random() - 0.5) * 200;
            break;
          case 'energyBeam':
            particle.vx = Math.random() * config.startSpeed[1];
            particle.vy = -Math.random() * config.startSpeed[1];
            break;
          case 'coinTrail':
            particle.vx = (Math.random() - 0.5) * 100;
            particle.vy = Math.random() * 50;
            break;
          case 'magicalAura':
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * config.startSpeed[1];
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            break;
          case 'explosion':
            const explosionAngle = Math.random() * Math.PI * 2;
            const explosionSpeed = Math.random() * config.startSpeed[1];
            particle.vx = Math.cos(explosionAngle) * explosionSpeed;
            particle.vy = Math.sin(explosionAngle) * explosionSpeed;
            break;
        }

        particlesRef.current.push(particle);
      }
    };

    // Update particle positions and properties
    const updateParticles = (app: Application, texture: Texture) => {
      const particles = particlesRef.current;
      const container = containerRef.current;
      
      if (!container) return;

      // Remove old sprites
      container.removeChildren();

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update physics
        particle.x += particle.vx * 0.016; // 60fps
        particle.y += particle.vy * 0.016;
        
        // Apply gravity
        particle.vy += config.gravity.y * 0.016;
        particle.vx += config.gravity.x * 0.016;
        
        // Update life
        particle.life += 16; // 60fps
        
        // Update rotation
        particle.rotation += particle.rotationSpeed;
        
        // Calculate alpha based on life
        particle.alpha = Math.max(0, 1 - (particle.life / particle.maxLife));
        
        // Remove dead particles
        if (particle.life >= particle.maxLife || particle.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Create sprite for this frame
        const sprite = new Sprite(texture);
        sprite.x = particle.x;
        sprite.y = particle.y;
        sprite.width = particle.size;
        sprite.height = particle.size;
        sprite.rotation = particle.rotation;
        sprite.alpha = particle.alpha;
        sprite.tint = particle.color;
        
        container.addChild(sprite);
      }

      // Check if all particles are dead and trigger completion
      if (particles.length === 0 && !isActiveRef.current && onComplete) {
        onComplete();
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      emit: (x: number, y: number, count?: number) => {
        emitParticles(x, y, count || 1);
      },
      stop: () => {
        isActiveRef.current = false;
      },
      start: () => {
        isActiveRef.current = true;
        lastEmitTimeRef.current = Date.now();
      },
      setPosition: (x: number, y: number) => {
        // Update emission position (for future use)
      },
      setColor: (newColor: string) => {
        color = newColor;
      }
    }));

    return (
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          pointerEvents: 'none'
        }}
      />
    );
  }
);

PixiParticleSystem.displayName = 'PixiParticleSystem';

// Convenience components for common effects
export const PixiSparkles = forwardRef<PixiParticleSystemRef, Omit<PixiParticleSystemProps, 'type'>>(
  (props, ref) => <PixiParticleSystem {...props} type="sparkle" ref={ref} />
);

export const PixiEnergyBeam = forwardRef<PixiParticleSystemRef, Omit<PixiParticleSystemProps, 'type'>>(
  (props, ref) => <PixiParticleSystem {...props} type="energyBeam" ref={ref} />
);

export const PixiCoinTrail = forwardRef<PixiParticleSystemRef, Omit<PixiParticleSystemProps, 'type'>>(
  (props, ref) => <PixiParticleSystem {...props} type="coinTrail" ref={ref} />
);

export const PixiMagicalAura = forwardRef<PixiParticleSystemRef, Omit<PixiParticleSystemProps, 'type'>>(
  (props, ref) => <PixiParticleSystem {...props} type="magicalAura" ref={ref} />
);

export const PixiExplosion = forwardRef<PixiParticleSystemRef, Omit<PixiParticleSystemProps, 'type'>>(
  (props, ref) => <PixiParticleSystem {...props} type="explosion" ref={ref} />
);

PixiSparkles.displayName = 'PixiSparkles';
PixiEnergyBeam.displayName = 'PixiEnergyBeam';
PixiCoinTrail.displayName = 'PixiCoinTrail';
PixiMagicalAura.displayName = 'PixiMagicalAura';
PixiExplosion.displayName = 'PixiExplosion';
