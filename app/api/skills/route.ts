import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeSkill } from '@/features/skills/repositories';
import { CreateSkillSchema } from '@/features/skills/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/skills?lifeAreaId=...
 * Returns list of skills for authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const searchParams = request.nextUrl.searchParams;
    const lifeAreaIdParam = searchParams.get('lifeAreaId');
    const lifeAreaId = lifeAreaIdParam ? Number(lifeAreaIdParam) : undefined;

    const skills = await withRequestContext(async ({ skill }) => {
      const entities = await skill.findAllSkills(userId, lifeAreaId);
      return entities.map(serializeSkill);
    });

    return NextResponse.json(
      { skills },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get skills in GET /api/skills:', error);
    return NextResponse.json(
      { skills: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/skills
 * Creates a new Skill.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateSkillSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ skill }) => {
      return await skill.createSkill({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { skill: serializeSkill(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create skill in POST /api/skills:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
