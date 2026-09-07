/**
 * Centralized documentation link configuration.
 *
 * Replace the placeholder paths below with real URLs or file paths
 * once the actual documents (PDFs, pages, etc.) are available.
 *
 * Example:
 *   chapter1: '/docs/chapters/chapter-1.pdf',
 *   prd: 'https://docs.google.com/document/d/...',
 */
export const docLinks = {
  // Research Foundation
  chapter1: '/docs#chapter1',
  chapter2: '/docs#chapter2',
  relatedResearch: '/docs#related-research',

  // System Design
  chapter3: '/docs#chapter3',
  prd: '/docs#prd',
  architecture: '/docs#architecture',
  database: '/docs#database',

  // Implementation & Evaluation
  chapter4: '/docs#chapter4',
  chapter5: '/docs#chapter5',
  testing: '/docs#testing',
  userGuide: '/docs#user-guide',
} as const;

export type DocLinkKey = keyof typeof docLinks;
