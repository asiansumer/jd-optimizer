import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/core/db';
import { jds, NewJD } from '@/lib/db/schema/jd';
import { generateJD, JDGenerationInput } from '@/lib/ai/jd-generator';
import { getUserInfo } from '@/shared/models/user';
import { sql, desc, eq } from 'drizzle-orm';

/**
 * GET /api/jds - Get user's JD list
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const id = searchParams.get('id');

    // If ID is provided, return single JD
    if (id) {
      const jd = await db()
        .select()
        .from(jds)
        .where(eq(jds.id, parseInt(id)))
        .limit(1);

      if (jd.length === 0) {
        return NextResponse.json({ error: 'JD not found' }, { status: 404 });
      }

      if (jd[0].userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.json(jd[0]);
    }

    // Return list of JDs
    const offset = (page - 1) * limit;
    const userJds = await db()
      .select()
      .from(jds)
      .where(eq(jds.userId, user.id))
      .orderBy(desc(jds.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db()
      .select({ count: sql<number>`count(*)` })
      .from(jds)
      .where(eq(jds.userId, user.id));

    return NextResponse.json({
      data: userJds,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching JDs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch JDs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jds - Create new JD
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = JDGenerationInput.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { position, techStack, salaryRange, experience, templateId } =
      validationResult.data;

    // Generate JD using AI
    const generatedJD = await generateJD({
      position,
      techStack,
      salaryRange,
      experience,
      templateId,
    });

    // Save to database
    const newJD: NewJD = {
      title: generatedJD.title,
      content: generatedJD.content,
    };

    const jdId = await db()
      .insert(jds)
      .values({
        ...newJD,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: jds.id });

    // Fetch the created JD
    const [createdJD] = await db()
      .select()
      .from(jds)
      .where(eq(jds.id, jdId[0].id))
      .limit(1);

    return NextResponse.json(
      {
        ...createdJD,
        generated: {
          requirements: generatedJD.requirements,
          responsibilities: generatedJD.responsibilities,
          benefits: generatedJD.benefits,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating JD:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create JD' },
      { status: 500 }
    );
  }
}
