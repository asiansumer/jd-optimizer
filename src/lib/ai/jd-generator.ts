import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { z } from 'zod';

import { db } from '@/core/db';
import { jdTemplates, NewJD } from '@/lib/db/schema/jd';
import { getTemplateById } from './templates';
import { generateUserPrompt, getCategoryPrompt, JD_SYSTEM_PROMPT } from './prompts';

/**
 * JD Generation Input Schema
 */
export const JDGenerationInput = z.object({
  position: z.string().min(1, 'Position is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  salaryRange: z.string().optional(),
  experience: z.string().optional(),
  templateId: z.string().optional(),
  workType: z.string().optional(),
  companyInfo: z.object({
    companyName: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    culture: z.string().optional(),
    location: z.string().optional(),
    remotePolicy: z.string().optional(),
  }).optional(),
  category: z.string().optional(),
});

export type JDGenerationInputType = z.infer<typeof JDGenerationInput>;

/**
 * Generated JD Response Schema
 */
export const GeneratedJD = z.object({
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  preferredQualifications: z.array(z.string()),
  responsibilities: z.array(z.string()),
  benefits: z.array(z.string()),
  salarySuggestion: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
    note: z.string().optional(),
  }).optional(),
  interviewQuestions: z.array(z.object({
    category: z.string(),
    question: z.string(),
    purpose: z.string(),
  })),
});

export type GeneratedJDType = z.infer<typeof GeneratedJD>;

/**
 * Generate JD using AI
 */
export async function generateJD(input: JDGenerationInputType): Promise<GeneratedJDType> {
  const {
    position,
    techStack,
    salaryRange,
    experience,
    templateId,
    workType,
    companyInfo,
    category,
  } = input;

  // Load template if specified
  let templateContent = '';
  if (templateId) {
    const template = getTemplateById(templateId);
    if (template) {
      templateContent = template.content;
    }
  }

  // Generate user prompt with all variables
  const userPrompt = generateUserPrompt({
    position,
    techStack,
    salaryRange,
    experience,
    workType,
    templateContent,
  });

  // Add category-specific guidance if provided
  let enhancedSystemPrompt = JD_SYSTEM_PROMPT;
  if (category) {
    const categoryPrompt = getCategoryPrompt(category);
    if (categoryPrompt) {
      enhancedSystemPrompt += `\n\nFor this position, ${categoryPrompt}.`;
    }
  }

  // Get OpenRouter API key from environment
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!openrouterApiKey) {
    throw new Error('OpenRouter API key is not configured');
  }

  const openrouter = createOpenRouter({
    apiKey: openrouterApiKey,
  });

  // Call AI model (use Claude 3.5 Sonnet for best quality, or GPT-4 as fallback)
  const result = await generateText({
    model: openrouter.chat('anthropic/claude-3.5-sonnet'),
    system: enhancedSystemPrompt,
    prompt: userPrompt,
    temperature: 0.7,
    maxTokens: 3000,
  });

  // Parse the generated response
  const generatedText = result.text;

  // Try to extract JSON from the response
  let jdData: GeneratedJDType;

  // Extract JSON from markdown code blocks if present
  const jsonMatch = generatedText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : generatedText;

  try {
    // Try to parse JSON directly
    jdData = JSON.parse(jsonString) as GeneratedJDType;

    // Validate the parsed data
    const validationResult = GeneratedJD.safeParse(jdData);
    if (!validationResult.success) {
      // If validation fails, fall back to text parsing
      console.warn('Generated JD does not match schema, falling back to text parsing');
      jdData = parseJDFromText(generatedText, position);
    }
  } catch (error) {
    // If JSON parsing fails, parse as text
    console.warn('Failed to parse JSON, falling back to text parsing');
    jdData = parseJDFromText(generatedText, position);
  }

  return jdData;
}

/**
 * Parse JD from plain text format (fallback)
 */
function parseJDFromText(text: string, position: string): GeneratedJDType {
  return {
    title: extractSection(text, /(?:job\s*)?title|position|role/i, position) || position,
    summary: extractSection(text, /summary|overview|about\s+the\s+role/i, '') || 'A challenging and rewarding opportunity for a skilled professional.',
    description: extractFullDescription(text),
    requirements: extractSectionItems(text, /requirements?|what\s+we're\s+looking\s+for|qualifications/i) || [],
    preferredQualifications: extractSectionItems(text, /preferred\s+qualifications?|nice\s+to\s+have|bonus/i) || [],
    responsibilities: extractSectionItems(text, /responsibilities?|what\s+you'll\s+do|key\s+duties/i) || [],
    benefits: extractSectionItems(text, /benefits?|perks?|what\s+we\s+offer/i) || [],
    salarySuggestion: undefined,
    interviewQuestions: [],
  };
}

/**
 * Extract a section from text
 */
function extractSection(text: string, regex: RegExp, defaultValue: string = ''): string {
  const match = text.match(new RegExp(`${regex.source}[:\\s]*([^\\n]+)`, 'i'));
  return match ? match[1].trim() : defaultValue;
}

/**
 * Extract full description text (main content)
 */
function extractFullDescription(text: string): string {
  // Remove common section headers and return the main content
  const cleanText = text
    .replace(/^(job\s*)?(title|position|role)[:\\s]*[^\\n]+/im, '')
    .replace(/^(summary|overview|about\s+the\s+role)[:\\s]*[\\s\\S]*?(?=\\n\\n[A-Z]|$)/im, '')
    .replace(/^(requirements?|qualifications?|what\s+we're\s+looking\s+for)[:\\s]*[\\s\\S]*?(?=\\n\\n[A-Z]|$)/im, '')
    .replace(/^(responsibilities?|what\s+you'll\s+do|key\s+duties)[:\\s]*[\\s\\S]*?(?=\\n\\n[A-Z]|$)/im, '')
    .replace(/^(benefits?|perks?|what\s+we\s+offer)[:\\s]*[\\s\\S]*?(?=\\n\\n[A-Z]|$)/im, '')
    .replace(/^(interview\s+questions?|about\s+the\s+company)[:\\s]*[\\s\\S]*?(?=\\n\\n[A-Z]|$)/im, '')
    .trim();

  return cleanText || 'Join our team and contribute to exciting projects in a dynamic environment.';
}

/**
 * Helper function to extract bullet points from a section
 */
function extractSectionItems(text: string, sectionRegex: RegExp): string[] {
  const sectionMatch = text.match(new RegExp(`(${sectionRegex.source}[\\s\\S]*?)(?=\\n\\n[A-Z]|\\n\\n\\*\\*|$)`, 'i'));
  if (!sectionMatch) return [];

  const sectionText = sectionMatch[1];
  const bulletPoints = sectionText
    .split('\n')
    .filter((line) => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().match(/^\d+\./))
    .map((line) => line.replace(/^[•\-\*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter((point) => point.length > 0);

  return bulletPoints;
}

// Import jds table and eq operator
import { jds } from '@/lib/db/schema/jd';
import { eq } from 'drizzle-orm';

/**
 * Save generated JD to database
 */
export async function saveJD(userId: string, jd: NewJD): Promise<number> {
  const result = await db()
    .insert(jds)
    .values({
      ...jd,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: jds.id });

  return result[0].id;
}
