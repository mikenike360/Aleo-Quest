/**
 * Simple seeded hash function for mock proof generation
 * NOT cryptographically secure - only for demo purposes
 */
export function simpleHash(input: string, seed: number = 0): string {
  let hash = seed;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex-like string
  const hashStr = Math.abs(hash).toString(16).padStart(16, '0');
  return `0x${hashStr}${Math.random().toString(16).slice(2, 18)}`;
}

export function generateCommitment(secret: string): string {
  return simpleHash(secret, 42);
}

export function generateProof(commitment: string, predicate: string): {
  verified: boolean;
  proof: string;
} {
  // Mock verification - always succeeds
  const proof = simpleHash(`${commitment}:${predicate}`, 123);
  return { verified: true, proof };
}

export function mockDelay(minMs: number = 400, maxMs: number = 800): Promise<number> {
  const delay = Math.floor(Math.random() * (maxMs - minMs) + minMs);
  return new Promise(resolve => setTimeout(() => resolve(delay), delay));
}

