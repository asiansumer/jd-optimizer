import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/core/db';
import { jds } from '@/lib/db/schema/jd';
import { getUserInfo } from '@/shared/models/user';
import { eq } from 'drizzle-orm';

/**
 * GET /api/jds/[id] - Get single JD detail
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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
  } catch (error: any) {
    console.error('Error fetching JD:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch JD' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/jds/[id] - Update JD
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Check if JD exists and belongs to user
    const existingJD = await db()
      .select()
      .from(jds)
      .where(eq(jds.id, parseInt(id)))
      .limit(1);

    if (existingJD.length === 0) {
      return NextResponse.json({ error: 'JD not found' }, { status: 404 });
    }

    if (existingJD[0].userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update JD
    const [updatedJD] = await db()
      .update(jds)
      .set({
        title: body.title || existingJD[0].title,
        content: body.content || existingJD[0].content,
        updatedAt: new Date(),
      })
      .where(eq(jds.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedJD);
  } catch (error: any) {
    console.error('Error updating JD:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update JD' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jds/[id] - Delete JD
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if JD exists and belongs to user
    const existingJD = await db()
      .select()
      .from(jds)
      .where(eq(jds.id, parseInt(id)))
      .limit(1);

    if (existingJD.length === 0) {
      return NextResponse.json({ error: 'JD not found' }, { status: 404 });
    }

    if (existingJD[0].userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete JD
    await db().delete(jds).where(eq(jds.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting JD:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete JD' },
      { status: 500 }
    );
  }
}
