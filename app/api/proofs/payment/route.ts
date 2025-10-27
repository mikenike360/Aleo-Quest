import { NextRequest, NextResponse } from 'next/server';
import { simpleHash, mockDelay } from '@/lib/hash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currentBalance } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Simulate proof generation delay
    const ms = await mockDelay(600, 1000);

    // Mock balance (in real app, this would come from encrypted records)
    const balance = currentBalance || 1000;
    const hasEnoughBalance = balance >= amount;

    if (!hasEnoughBalance) {
      return NextResponse.json({
        verified: false,
        error: 'Insufficient balance',
        ms,
      });
    }

    // Generate masked new balance (hide exact amount)
    const newBalance = balance - amount;
    const newBalanceMasked = `${simpleHash(newBalance.toString()).slice(0, 10)}...`;

    // TODO: Replace with real Aleo private payment proof
    // const result = await AleoSDK.generatePaymentProof({
    //   amount,
    //   inputRecords,
    //   recipient,
    // });

    return NextResponse.json({
      verified: true,
      newBalanceMasked,
      proof: simpleHash(`payment:${amount}:${Date.now()}`),
      ms,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/proofs/payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

