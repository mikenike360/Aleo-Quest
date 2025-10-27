// Physics configuration presets for different interaction types
export const SPRING_CONFIGS = {
  // Gentle animations for subtle UI feedback
  gentle: {
    tension: 170,
    friction: 26,
    mass: 1
  },
  
  // Bouncy animations for coins and proofs
  bouncy: {
    tension: 300,
    friction: 10,
    mass: 1
  },
  
  // Elastic animations for vault doors and selections
  elastic: {
    tension: 400,
    friction: 30,
    mass: 0.8
  },
  
  // Snappy animations for instant feedback
  snappy: {
    tension: 500,
    friction: 35,
    mass: 0.5
  },
  
  // Magnetic attraction for proof combination
  magnetic: {
    tension: 200,
    friction: 15,
    mass: 0.3
  }
} as const;

// Gesture configuration presets
export const GESTURE_CONFIGS = {
  // Drag with momentum and bounds
  dragWithMomentum: {
    rubberband: true,
    filterTaps: true,
    threshold: 5
  },
  
  // Drag with magnetic snapping
  magneticDrag: {
    rubberband: true,
    filterTaps: true,
    threshold: 3,
    bounds: { left: -50, right: 50, top: -50, bottom: 50 }
  },
  
  // Coin throwing with physics
  coinThrow: {
    rubberband: false,
    filterTaps: false,
    threshold: 1,
    bounds: { left: -200, right: 200, top: -200, bottom: 200 }
  },
  
  // Vault rotation
  vaultRotation: {
    rubberband: true,
    filterTaps: true,
    threshold: 2,
    bounds: { left: -180, right: 180, top: -180, bottom: 180 }
  }
} as const;

// Physics constants
export const PHYSICS_CONSTANTS = {
  // Gravity in pixels per second squared
  gravity: 980,
  
  // Air resistance coefficient
  airResistance: 0.98,
  
  // Bounce restitution (0 = no bounce, 1 = perfect bounce)
  restitution: 0.6,
  
  // Friction coefficient
  friction: 0.8,
  
  // Magnetic field strength
  magneticStrength: 0.3,
  
  // Snap distance for magnetic attraction
  snapDistance: 50,
  
  // Velocity decay for momentum
  velocityDecay: 0.95
} as const;

// Animation timing presets
export const ANIMATION_TIMING = {
  // Quick feedback animations
  quick: 150,
  
  // Standard UI animations
  standard: 300,
  
  // Smooth transitions
  smooth: 500,
  
  // Long dramatic animations
  dramatic: 1000
} as const;

// Particle system configurations
export const PARTICLE_CONFIGS = {
  // Sparkle effects
  sparkle: {
    maxParticles: 100,
    emissionRate: 30,
    lifetime: 1500,
    startSpeed: [50, 150],
    gravity: { x: 0, y: 100 },
    blendMode: 'ADD' as const
  },
  
  // Energy beams
  energyBeam: {
    maxParticles: 200,
    emissionRate: 60,
    lifetime: 2000,
    startSpeed: [100, 200],
    gravity: { x: 0, y: 0 },
    blendMode: 'ADD' as const
  },
  
  // Coin trails
  coinTrail: {
    maxParticles: 50,
    emissionRate: 20,
    lifetime: 1000,
    startSpeed: [20, 80],
    gravity: { x: 0, y: 200 },
    blendMode: 'NORMAL' as const
  },
  
  // Magical auras
  magicalAura: {
    maxParticles: 300,
    emissionRate: 40,
    lifetime: 3000,
    startSpeed: [30, 120],
    gravity: { x: 0, y: -50 },
    blendMode: 'ADD' as const
  },
  
  // Explosion effects
  explosion: {
    maxParticles: 500,
    emissionRate: 100,
    lifetime: 2000,
    startSpeed: [200, 400],
    gravity: { x: 0, y: 300 },
    blendMode: 'ADD' as const
  }
} as const;

// Color palettes for different effects
export const EFFECT_COLORS = {
  vault: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD'
  },
  length: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD'
  },
  age: {
    primary: '#EAB308',
    secondary: '#F59E0B',
    accent: '#FBBF24'
  },
  payment: {
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#6EE7B7'
  },
  combined: {
    primary: '#06B6D4',
    secondary: '#22D3EE',
    accent: '#67E8F9'
  },
  magical: {
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#F9A8D4'
  }
} as const;

// Utility functions for physics calculations
export const PhysicsUtils = {
  // Calculate magnetic attraction force
  calculateMagneticForce: (distance: number, strength: number = PHYSICS_CONSTANTS.magneticStrength) => {
    return Math.max(0, strength * (1 - distance / PHYSICS_CONSTANTS.snapDistance));
  },
  
  // Apply air resistance to velocity
  applyAirResistance: (velocity: number) => {
    return velocity * PHYSICS_CONSTANTS.airResistance;
  },
  
  // Calculate bounce velocity
  calculateBounce: (velocity: number, restitution: number = PHYSICS_CONSTANTS.restitution) => {
    return velocity * restitution;
  },
  
  // Snap to nearest grid point
  snapToGrid: (value: number, gridSize: number) => {
    return Math.round(value / gridSize) * gridSize;
  },
  
  // Calculate distance between two points
  distance: (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },
  
  // Linear interpolation
  lerp: (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  },
  
  // Ease out cubic
  easeOutCubic: (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  },
  
  // Ease in out cubic
  easeInOutCubic: (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
} as const;
