import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getFrameworkItemsQuery } from '@/features/framework/queries';
import { serializeFrameworkItem } from '@/features/framework/repositories';
import { CreateFrameworkItemSchema } from '@/features/framework/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/framework?category=Career|...&section=Visions|Rules|Concepts
 * Calls getFrameworkItemsQuery and returns JSON payload for client SWR consumption.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category') || undefined;
    const sectionParam = searchParams.get('section') || undefined;

    const items = await getFrameworkItemsQuery(categoryParam, sectionParam);

    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get framework items in GET /api/framework:', error);
    return NextResponse.json(
      { items: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/framework
 * Validates with ArkType CreateFrameworkItemSchema and persists via FrameworkRepository.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateFrameworkItemSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ framework }) => {
      return await framework.createItem({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { item: serializeFrameworkItem(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create framework item in POST /api/framework:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
