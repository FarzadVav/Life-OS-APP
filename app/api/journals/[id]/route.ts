import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getJournalByIdQuery } from '@/features/journals/queries';
import { serializeJournal } from '@/features/journals/repositories';
import { UpdateJournalSchema } from '@/features/journals/types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/journals/[id]
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const journalId = Number(id);

    if (isNaN(journalId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const journal = await getJournalByIdQuery(journalId);
    if (!journal) {
      return NextResponse.json({ message: 'Journal entry not found' }, { status: 404 });
    }

    return NextResponse.json(
      { journal },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    );
  } catch (error) {
    console.error('Failed to get journal by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/journals/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const journalId = Number(id);

    if (isNaN(journalId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = UpdateJournalSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const updated = await withRequestContext(async ({ journal }) => {
      return await journal.updateJournal(journalId, validation, userId);
    });

    if (!updated) {
      return NextResponse.json({ message: 'Journal entry not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ journal: serializeJournal(updated) }, { status: 200 });
  } catch (error) {
    console.error('Failed to update journal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/journals/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const journalId = Number(id);

    if (isNaN(journalId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const success = await withRequestContext(async ({ journal }) => {
      return await journal.deleteJournal(journalId, userId);
    });

    if (!success) {
      return NextResponse.json({ message: 'Journal entry not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete journal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
