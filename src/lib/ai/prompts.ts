/**
 * System prompts and user prompt templates for JD generation
 */

/**
 * System prompt for JD generation
 */
export const JD_SYSTEM_PROMPT = `You are an expert HR and recruitment specialist with 15+ years of experience in crafting compelling, inclusive, and professional job descriptions. Your expertise includes:

- Writing clear, engaging job titles that attract top talent
- Creating comprehensive role summaries that accurately reflect position requirements
- Identifying key responsibilities and requirements for various technical roles
- Understanding industry standards and best practices for compensation
- Crafting interview questions that effectively assess candidate capabilities
- Ensuring all language is inclusive, professional, and appealing to diverse candidates

When generating job descriptions, always:
1. Use clear, professional language
2. Focus on what candidates can achieve and learn
3. Avoid jargon unless necessary for the specific role
4. Be realistic and honest about requirements
5. Include growth and development opportunities
6. Highlight company culture and values`;

/**
 * User prompt template for JD generation
 */
export const JD_USER_PROMPT_TEMPLATE = `Generate a professional job description for the following position:

**Position Details:**
- Position/Title: {{position}}
- Tech Stack: {{techStack}}
{{#if salaryRange}}
- Salary Range: {{salaryRange}}
{{/if}}
{{#if experience}}
- Experience Level: {{experience}}
{{/if}}
{{#if workType}}
- Work Type: {{workType}} (Remote/On-site/Hybrid)
{{/if}}

{{#if templateContent}}
**Reference Template:**
{{templateContent}}
{{/if}}

Please generate a comprehensive Job Description in the following JSON format:

{
  "title": "Engaging job title",
  "summary": "3-4 sentences describing the role",
  "description": "Detailed position description",
  "requirements": [
    "Must-have requirement 1",
    "Must-have requirement 2"
  ],
  "preferredQualifications": [
    "Nice-to-have qualification 1",
    "Nice-to-have qualification 2"
  ],
  "responsibilities": [
    "Key responsibility 1",
    "Key responsibility 2"
  ],
  "benefits": [
    "Benefit 1",
    "Benefit 2"
  ],
  "salarySuggestion": {
    "min": number,
    "max": number,
    "currency": "USD",
    "note": "Explanation of salary range"
  },
  "interviewQuestions": [
    {
      "category": "Technical",
      "question": "Question text",
      "purpose": "What this question assesses"
    }
  ]
}`;

/**
 * JSON Schema for JD output
 */
export const JD_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Engaging and clear job title"
    },
    summary: {
      type: "string",
      description: "3-4 sentences summarizing the role"
    },
    description: {
      type: "string",
      description: "Detailed position description"
    },
    requirements: {
      type: "array",
      items: { type: "string" },
      description: "Must-have requirements (5-8 items)",
      minItems: 3,
      maxItems: 10
    },
    preferredQualifications: {
      type: "array",
      items: { type: "string" },
      description: "Nice-to-have qualifications (3-5 items)",
      minItems: 0,
      maxItems: 8
    },
    responsibilities: {
      type: "array",
      items: { type: "string" },
      description: "Key responsibilities (5-8 items)",
      minItems: 3,
      maxItems: 12
    },
    benefits: {
      type: "array",
      items: { type: "string" },
      description: "Benefits and perks (5-7 items)",
      minItems: 3,
      maxItems: 10
    },
    salarySuggestion: {
      type: "object",
      properties: {
        min: { type: "number" },
        max: { type: "number" },
        currency: { type: "string", default: "USD" },
        note: { type: "string" }
      }
    },
    interviewQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["Technical", "Behavioral", "Situational", "Cultural Fit"]
          },
          question: { type: "string" },
          purpose: { type: "string" }
        },
        required: ["category", "question", "purpose"]
      },
      description: "Interview questions to assess candidates (5-8 questions)",
      minItems: 3,
      maxItems: 10
    }
  },
  required: [
    "title",
    "summary",
    "description",
    "requirements",
    "preferredQualifications",
    "responsibilities",
    "benefits",
    "interviewQuestions"
  ]
};

/**
 * Function to replace template variables
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  // Handle {{#if variable}} blocks
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => {
    return variables[key] ? content : '';
  });

  // Handle {{variable}} replacements
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = variables[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value !== undefined ? String(value) : `{{${key}}}`;
  });

  return result;
}

/**
 * Generate user prompt with variables
 */
export function generateUserPrompt(variables: {
  position: string;
  techStack: string[];
  salaryRange?: string;
  experience?: string;
  workType?: string;
  templateContent?: string;
}): string {
  return replaceTemplateVariables(JD_USER_PROMPT_TEMPLATE, variables);
}

/**
 * Default prompts for different job categories
 */
export const CATEGORY_PROMPTS: Record<string, string> = {
  frontend: "Focus on frontend technologies, user experience, and modern JavaScript frameworks",
  backend: "Focus on server-side technologies, APIs, databases, and system architecture",
  fullstack: "Focus on both frontend and backend technologies with emphasis on full-cycle development",
  mobile: "Focus on mobile development, platform-specific technologies, and mobile UX patterns",
  devops: "Focus on infrastructure, CI/CD, cloud platforms, and automation",
  design: "Focus on design tools, UX principles, visual design, and user research methods",
  data: "Focus on data processing, analytics, machine learning, and data infrastructure",
  security: "Focus on security best practices, threat analysis, and secure coding"
};

/**
 * Get category-specific prompt additions
 */
export function getCategoryPrompt(category: string): string {
  return CATEGORY_PROMPTS[category.toLowerCase()] || "";
}
