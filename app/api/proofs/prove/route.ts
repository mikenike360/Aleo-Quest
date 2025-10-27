import { NextRequest, NextResponse } from 'next/server';
import { generateProof, mockDelay } from '@/lib/hash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commitment, predicate } = body;

    if (!commitment || typeof commitment !== 'string') {
      return NextResponse.json(
        { error: 'Commitment is required and must be a string' },
        { status: 400 }
      );
    }

    if (!predicate || typeof predicate !== 'string') {
      return NextResponse.json(
        { error: 'Predicate is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate proof generation delay
    const ms = await mockDelay(500, 900);

    // Generate mock proof (always succeeds in demo)
    const { verified, proof } = generateProof(commitment, predicate);

    // TODO: Replace with real Aleo proof generation and verification
    // const result = await AleoSDK.generateAndVerifyProof({
    //   commitment,
    //   predicate,
    // });

    return NextResponse.json({
      verified,
      proof,
      ms,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/proofs/prove:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

