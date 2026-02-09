import type { Block, Node } from '@contentful/rich-text-types';

import { BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import sanitizeHtml from 'sanitize-html';

const strictSanitizeOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 'i', 'b',
    'ul', 'ol', 'li',
    'a',
    'blockquote',
    'code', 'pre'
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    '*': ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href'],
  enforceHtmlBoundary: true
};

const defaultRichTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Block, next: (content: Node[]) => string) => `<p>${next(node.content)}</p>`,
    [BLOCKS.UL_LIST]: (node: Block, next: (content: Node[]) => string) => `<ul>${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: Block, next: (content: Node[]) => string) => `<ol>${next(node.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (node: Block, next: (content: Node[]) => string) => `<li>${next(node.content)}</li>`,
    [BLOCKS.HEADING_1]: (node: Block, next: (content: Node[]) => string) => `<h1>${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: Block, next: (content: Node[]) => string) => `<h2>${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: Block, next: (content: Node[]) => string) => `<h3>${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: Block, next: (content: Node[]) => string) => `<h4>${next(node.content)}</h4>`,
    [BLOCKS.HEADING_5]: (node: Block, next: (content: Node[]) => string) => `<h5>${next(node.content)}</h5>`,
    [BLOCKS.HEADING_6]: (node: Block, next: (content: Node[]) => string) => `<h6>${next(node.content)}</h6>`,
  },
};

export function displayRichText(richText: { json?: unknown } | null | undefined): string {
  if (!richText || !richText.json || typeof richText.json !== 'object') {
    return '';
  }
  
  const displayHtml = documentToHtmlString(richText.json as any, defaultRichTextOptions as any);
  return sanitizeHtml(displayHtml, strictSanitizeOptions);
}