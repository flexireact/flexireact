/**
 * Template definitions for create-flexireact
 */

import { defaultTemplate } from './default.js';
import { minimalTemplate } from './minimal.js';
import { appRouterTemplate } from './app-router.js';

export interface Template {
  name: string;
  description: string;
  icon: string;
}

export const TEMPLATES: Record<string, Template> = {
  default: {
    name: 'Default',
    description: 'Full-featured template with routes/, components, and Tailwind v4',
    icon: '⚡',
  },
  minimal: {
    name: 'Minimal',
    description: 'Bare minimum FlexiReact setup',
    icon: '📦',
  },
  'app-router': {
    name: 'App Router',
    description: 'Next.js style app/ directory routing',
    icon: '🚀',
  },
};

export type TemplateFiles = Record<string, string>;

export function getTemplateFiles(templateKey: string, projectName: string): TemplateFiles {
  switch (templateKey) {
    case 'minimal':
      return minimalTemplate(projectName);
    case 'app-router':
      return appRouterTemplate(projectName);
    default:
      return defaultTemplate(projectName);
  }
}
