export { generateJD, saveJD } from './jd-generator';
export {
  JDGenerationInput,
  JDGenerationInputType,
  GeneratedJD,
  GeneratedJDType,
} from './jd-generator';

export {
  JD_TEMPLATES,
  getTemplateById,
  getTemplatesByCategory,
  getTemplateCategories,
  applyCompanyInfo,
  getAllTemplates,
} from './templates';

export {
  JD_SYSTEM_PROMPT,
  JD_USER_PROMPT_TEMPLATE,
  JD_OUTPUT_SCHEMA,
  replaceTemplateVariables,
  generateUserPrompt,
  CATEGORY_PROMPTS,
  getCategoryPrompt,
} from './prompts';

export type { JDTemplate } from './templates';
