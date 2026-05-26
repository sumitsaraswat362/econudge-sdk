import { NextRequest, NextResponse } from 'next/server';
import { generateNudge } from '@/lib/engine';
import type { UserAction } from '@/lib/types';

/** Simulate real-world API latency */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a JSON object.' },
        { status: 400 }
      );
    }

    const { category, title, description } = body as Partial<UserAction>;

    if (!category || !['transport', 'food', 'shopping'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid or missing "category". Must be one of: transport, food, shopping.' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "title" field.' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "description" field.' },
        { status: 400 }
      );
    }

    const action: UserAction = {
      id: body.id ?? `action-${Date.now().toString(36)}`,
      category,
      title,
      description,
      // transport-specific
      ...(body.distance != null && { distance: Number(body.distance) }),
      ...(body.mode != null && { mode: String(body.mode) }),
      // food-specific
      ...(body.cuisine != null && { cuisine: String(body.cuisine) }),
      ...(body.mealType != null && { mealType: String(body.mealType) }),
      ...(body.packagingType != null && { packagingType: String(body.packagingType) }),
      // shopping-specific
      ...(body.productType != null && { productType: String(body.productType) }),
      ...(body.shippingMode != null && { shippingMode: String(body.shippingMode) }),
      ...(body.quantity != null && { quantity: Number(body.quantity) }),
    };

    // Simulate real API latency
    await delay(300);

    const nudgeResponse = generateNudge(action);

    return NextResponse.json(nudgeResponse, { status: 200 });
  } catch (error: unknown) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    console.error('[EcoNudge API] Unexpected error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
