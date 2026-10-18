import { NextResponse } from 'next/server';
import { getFrameworkStatsQuery } from '@/features/framework/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/framework/stats
 * Returns aggregated category counts, section counts, and total items count.
 */
export async function GET() {
  try {
    const stats = await getFrameworkStatsQuery();
    return NextResponse.json(
      { stats },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    );
  } catch (error) {
    console.error('Failed to get framework stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
