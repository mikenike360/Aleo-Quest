import { NextRequest, NextResponse } from 'next/server';
import { generateCommitment, mockDelay } from '@/lib/hash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (!secret || typeof secret !== 'string') {
      return NextResponse.json(
        { error: 'Secret is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate proof generation delay
    const ms = await mockDelay(400, 800);

    // Generate mock commitment
    const commitment = generateCommitment(secret);

    // TODO: Replace with real Aleo commitment generation
    // const commitment = await AleoSDK.generateCommitment(secret);

    return NextResponse.json({
      commitment,
      ms,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/proofs/commit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

