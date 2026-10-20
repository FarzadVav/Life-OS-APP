import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getJournalsQuery } from '@/features/journals/queries';
import { serializeJournal } from '@/features/journals/repositories';
import { CreateJournalSchema } from '@/features/journals/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/journals?category=Logs|Thoughts|Feelings|Ideas|Notes|all
 * Calls getJournalsQuery and returns JSON payload for client SWR consumption.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category') || undefined;

    const journals = await getJournalsQuery(categoryParam);

    return NextResponse.json(
      { journals },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get journals in GET /api/journals:', error);
    return NextResponse.json(
      { journals: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/journals
 * Validates with ArkType CreateJournalSchema and persists via JournalRepository.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateJournalSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ journal }) => {
      return await journal.createJournal({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { journal: serializeJournal(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create journal in POST /api/journals:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
