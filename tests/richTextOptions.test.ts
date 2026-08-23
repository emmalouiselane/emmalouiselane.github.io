import { describe, expect, it } from 'vitest';

import { displayRichText } from '../src/lib/richTextOptions';

const documentWith = (content: unknown[]) => ({
  nodeType: 'document',
  data: {},
  content,
});

const paragraphWith = (value: string) => ({
  nodeType: 'paragraph',
  data: {},
  content: [{ nodeType: 'text', value, marks: [], data: {} }],
});

const textWith = (value: string, marks = []) => ({
  nodeType: 'text',
  value,
  marks,
  data: {},
});

describe('displayRichText', () => {
  it('returns an empty string for missing or invalid rich text', () => {
    expect(displayRichText(null)).toBe('');
    expect(displayRichText(undefined)).toBe('');
    expect(displayRichText({})).toBe('');
    expect(displayRichText({ json: null })).toBe('');
  });

  it('renders supported rich text as HTML', () => {
    expect(displayRichText({ json: documentWith([paragraphWith('Hello world')]) }))
      .toBe('<p>Hello world</p>');
  });

  it('renders headings, lists, and text marks', () => {
    const html = displayRichText({
      json: documentWith([
        {
          nodeType: 'heading-2',
          data: {},
          content: [textWith('A heading')],
        },
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [paragraphWith('First item')],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [paragraphWith('Second item')],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            textWith('Bold', [{ type: 'bold' }]),
            textWith(' and italic', [{ type: 'italic' }]),
          ],
        },
      ]),
    });

    expect(html).toContain('<h2>A heading</h2>');
    expect(html).toContain('<ul><li><p>First item</p></li><li><p>Second item</p></li></ul>');
    expect(html).toContain('<b>Bold</b>');
    expect(html).toContain('<i> and italic</i>');
  });

  it('escapes text that looks like HTML', () => {
    const html = displayRichText({
      json: documentWith([paragraphWith('<strong>not markup</strong>')]),
    });

    expect(html).toContain('&lt;strong&gt;not markup&lt;/strong&gt;');
    expect(html).not.toContain('<strong>not markup</strong>');
  });

  it('preserves allowed links and removes unsafe URL schemes', () => {
    const link = {
      nodeType: 'hyperlink',
      data: { uri: 'https://example.com' },
      content: [{ nodeType: 'text', value: 'Read more', marks: [], data: {} }],
    };
    const unsafeLink = {
      nodeType: 'hyperlink',
      data: { uri: 'javascript:alert(1)' },
      content: [{ nodeType: 'text', value: 'Unsafe', marks: [], data: {} }],
    };

    const html = displayRichText({
      json: documentWith([
        { nodeType: 'paragraph', data: {}, content: [link, unsafeLink] },
      ]),
    });

    expect(html).toContain('<a href="https://example.com">Read more</a>');
    expect(html).not.toContain('javascript:');
  });

  it('sanitises unsupported markup from rendered output', () => {
    const html = displayRichText({
      json: documentWith([
        paragraphWith('<script>alert(1)</script>Safe text'),
      ]),
    });

    expect(html).not.toContain('<script>');
    expect(html).toContain('Safe text');
  });

  it('removes disallowed attributes from links', () => {
    const link = {
      nodeType: 'hyperlink',
      data: { uri: 'https://example.com', onclick: 'alert(1)' },
      content: [textWith('Example')],
    };

    const html = displayRichText({
      json: documentWith([{ nodeType: 'paragraph', data: {}, content: [link] }]),
    });

    expect(html).toContain('<a href="https://example.com">Example</a>');
    expect(html).not.toContain('onclick');
  });
});
