'use client';

import { useRef, useCallback } from 'react';
import { useSpring, useSprings, SpringValue } from '@react-spring/web';
import { useDrag, useGesture } from '@use-gesture/react';
import { SPRING_CONFIGS, GESTURE_CONFIGS, PHYSICS_CONSTANTS, PhysicsUtils } from '@/components/zkVisuals/PhysicsConfig';

interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

interface UseGamePhysicsOptions {
  initialPosition?: { x: number; y: number };
  bounds?: { left: number; right: number; top: number; bottom: number };
  springConfig?: keyof typeof SPRING_CONFIGS;
  gestureConfig?: keyof typeof GESTURE_CONFIGS;
  enableGravity?: boolean;
  enableMagneticField?: boolean;
  magneticTarget?: { x: number; y: number };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCollision?: (other: PhysicsState) => void;
}

interface UseGamePhysicsReturn {
  // Spring values
  springs: {
    x: SpringValue<number>;
    y: SpringValue<number>;
    rotation: SpringValue<number>;
    scale: SpringValue<number>;
  };
  
  // Gesture bindings
  bind: any;
  
  // Physics state
  physics: PhysicsState;
  
  // Control methods
  setPosition: (x: number, y: number) => void;
  setVelocity: (vx: number, vy: number) => void;
  applyForce: (fx: number, fy: number) => void;
  snapToTarget: (target: { x: number; y: number }) => void;
  bounce: (restitution?: number) => void;
}

export function useGamePhysics(options: UseGamePhysicsOptions = {}): UseGamePhysicsReturn {
  const {
    initialPosition = { x: 0, y: 0 },
    bounds,
    springConfig = 'gentle',
    gestureConfig = 'dragWithMomentum',
    enableGravity = false,
    enableMagneticField = false,
    magneticTarget,
    onDragStart,
    onDragEnd,
    onCollision
  } = options;

  // Physics state ref
  const physicsRef = useRef<PhysicsState>({
    x: initialPosition.x,
    y: initialPosition.y,
    vx: 0,
    vy: 0,
    rotation: 0,
    scale: 1
  });

  // Spring animations
  const [{ x, y, rotation, scale }, api] = useSpring(() => ({
    x: initialPosition.x,
    y: initialPosition.y,
    rotation: 0,
    scale: 1,
    config: SPRING_CONFIGS[springConfig]
  }));

  // Update physics state
  const updatePhysics = useCallback((newState: Partial<PhysicsState>) => {
    physicsRef.current = { ...physicsRef.current, ...newState };
  }, []);

  // Apply gravity
  const applyGravity = useCallback(() => {
    if (!enableGravity) return;
    
    const { vy } = physicsRef.current;
    const newVy = vy + PHYSICS_CONSTANTS.gravity * 0.016; // 60fps
    
    updatePhysics({ vy: newVy });
    api.start({ y: physicsRef.current.y + newVy * 0.016 });
  }, [enableGravity, api, updatePhysics]);

  // Apply magnetic field
  const applyMagneticField = useCallback(() => {
    if (!enableMagneticField || !magneticTarget) return;
    
    const { x, y } = physicsRef.current;
    const distance = PhysicsUtils.distance(x, y, magneticTarget.x, magneticTarget.y);
    const force = PhysicsUtils.calculateMagneticForce(distance);
    
    if (force > 0) {
      const angle = Math.atan2(magneticTarget.y - y, magneticTarget.x - x);
      const fx = Math.cos(angle) * force;
      const fy = Math.sin(angle) * force;
      
      const { vx, vy } = physicsRef.current;
      updatePhysics({ vx: vx + fx, vy: vy + fy });
    }
  }, [enableMagneticField, magneticTarget, updatePhysics]);

  // Physics update loop
  const updatePhysicsLoop = useCallback(() => {
    const { x, y, vx, vy } = physicsRef.current;
    
    // Apply forces
    applyGravity();
    applyMagneticField();
    
    // Update position
    const newX = x + vx * 0.016;
    const newY = y + vy * 0.016;
    
    // Apply bounds
    let boundedX = newX;
    let boundedY = newY;
    let boundedVx = vx;
    let boundedVy = vy;
    
    if (bounds) {
      if (newX < bounds.left) {
        boundedX = bounds.left;
        boundedVx = PhysicsUtils.calculateBounce(vx);
      } else if (newX > bounds.right) {
        boundedX = bounds.right;
        boundedVx = PhysicsUtils.calculateBounce(vx);
      }
      
      if (newY < bounds.top) {
        boundedY = bounds.top;
        boundedVy = PhysicsUtils.calculateBounce(vy);
      } else if (newY > bounds.bottom) {
        boundedY = bounds.bottom;
        boundedVy = PhysicsUtils.calculateBounce(vy);
      }
    }
    
    // Apply air resistance
    boundedVx = PhysicsUtils.applyAirResistance(boundedVx);
    boundedVy = PhysicsUtils.applyAirResistance(boundedVy);
    
    // Update state
    updatePhysics({
      x: boundedX,
      y: boundedY,
      vx: boundedVx,
      vy: boundedVy
    });
    
    // Update springs
    api.start({
      x: boundedX,
      y: boundedY,
      immediate: false
    });
  }, [bounds, applyGravity, applyMagneticField, api, updatePhysics]);

  // Start physics loop
  const physicsLoopRef = useRef<number>();
  const startPhysicsLoop = useCallback(() => {
    if (physicsLoopRef.current) return;
    
    const loop = () => {
      updatePhysicsLoop();
      physicsLoopRef.current = requestAnimationFrame(loop);
    };
    
    physicsLoopRef.current = requestAnimationFrame(loop);
  }, [updatePhysicsLoop]);

  const stopPhysicsLoop = useCallback(() => {
    if (physicsLoopRef.current) {
      cancelAnimationFrame(physicsLoopRef.current);
      physicsLoopRef.current = undefined;
    }
  }, []);

  // Gesture handling
  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], last, first }) => {
      if (first) {
        onDragStart?.();
        stopPhysicsLoop();
      }
      
      if (last) {
        onDragEnd?.();
        
        // Apply velocity-based momentum
        const momentumX = vx * 0.1;
        const momentumY = vy * 0.1;
        
        updatePhysics({
          vx: momentumX,
          vy: momentumY
        });
        
        // Start physics loop for momentum
        startPhysicsLoop();
        
        // Stop physics loop after momentum decays
        setTimeout(() => {
          stopPhysicsLoop();
        }, 2000);
      } else {
        // Direct position control during drag
        const newX = initialPosition.x + mx;
        const newY = initialPosition.y + my;
        
        updatePhysics({ x: newX, y: newY });
        api.start({
          x: newX,
          y: newY,
          immediate: true
        });
      }
    },
    {
      ...GESTURE_CONFIGS[gestureConfig],
      from: () => [physicsRef.current.x, physicsRef.current.y]
    }
  );

  // Control methods
  const setPosition = useCallback((x: number, y: number) => {
    updatePhysics({ x, y });
    api.start({ x, y });
  }, [api, updatePhysics]);

  const setVelocity = useCallback((vx: number, vy: number) => {
    updatePhysics({ vx, vy });
  }, [updatePhysics]);

  const applyForce = useCallback((fx: number, fy: number) => {
    const { vx, vy } = physicsRef.current;
    updatePhysics({ vx: vx + fx, vy: vy + fy });
  }, [updatePhysics]);

  const snapToTarget = useCallback((target: { x: number; y: number }) => {
    updatePhysics({ x: target.x, y: target.y, vx: 0, vy: 0 });
    api.start({
      x: target.x,
      y: target.y,
      config: SPRING_CONFIGS.magnetic
    });
  }, [api, updatePhysics]);

  const bounce = useCallback((restitution: number = PHYSICS_CONSTANTS.restitution) => {
    const { vx, vy } = physicsRef.current;
    updatePhysics({
      vx: PhysicsUtils.calculateBounce(vx, restitution),
      vy: PhysicsUtils.calculateBounce(vy, restitution)
    });
  }, [updatePhysics]);

  return {
    springs: { x, y, rotation, scale },
    bind,
    physics: physicsRef.current,
    setPosition,
    setVelocity,
    applyForce,
    snapToTarget,
    bounce
  };
}

// Specialized hooks for common use cases
export function useCoinPhysics(options: Omit<UseGamePhysicsOptions, 'enableGravity'> = {}) {
  return useGamePhysics({
    ...options,
    enableGravity: true,
    springConfig: 'bouncy',
    gestureConfig: 'coinThrow'
  });
}

export function useMagneticPhysics(
  magneticTarget: { x: number; y: number },
  options: Omit<UseGamePhysicsOptions, 'enableMagneticField' | 'magneticTarget'> = {}
) {
  return useGamePhysics({
    ...options,
    enableMagneticField: true,
    magneticTarget,
    springConfig: 'magnetic',
    gestureConfig: 'magneticDrag'
  });
}

export function useVaultPhysics(options: Omit<UseGamePhysicsOptions, 'springConfig' | 'gestureConfig'> = {}) {
  return useGamePhysics({
    ...options,
    springConfig: 'elastic',
    gestureConfig: 'vaultRotation'
  });
}
