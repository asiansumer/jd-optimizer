import { NextRequest, NextResponse } from 'next/server';

import { generateJD, JDGenerationInput } from '@/lib/ai/jd-generator';
import { saveJD } from '@/lib/ai';
import { getCurrentUser } from '@/core/auth/client';
import { getAllTemplates, getTemplateCategories } from '@/lib/ai/templates';

/**
 * POST /api/jds/generate
 * Generate a new job description using AI
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validationResult = JDGenerationInput.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { position, techStack, salaryRange, experience, templateId, workType, companyInfo } = body;

    // Generate JD using AI
    const generatedJD = await generateJD({
      position,
      techStack,
      salaryRange,
      experience,
      templateId,
      workType,
    });

    // Save JD to database
    const jdId = await saveJD(user.id, {
      title: generatedJD.title,
      content: generatedJD.content,
      requirements: generatedJD.requirements,
      responsibilities: generatedJD.responsibilities,
      benefits: generatedJD.benefits,
      position,
      techStack,
      salaryRange,
      experience,
      workType,
      templateId,
    });

    // Return generated JD
    return NextResponse.json({
      id: jdId,
      ...generatedJD,
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating JD:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('OpenRouter API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/jds/generate
 * Get available options and templates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Return templates filtered by category if provided
    const templates = category
      ? getTemplatesByCategory(category)
      : getAllTemplates();

    return NextResponse.json({
      templates,
      categories: getTemplateCategories(),
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
