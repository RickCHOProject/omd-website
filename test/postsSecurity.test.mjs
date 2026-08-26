import assert from 'node:assert/strict';
import test from 'node:test';
import { remark } from 'remark';
import html from 'remark-html';

test('blog HTML sanitization removes executable raw HTML', async () => {
  const rendered = String(await remark().use(html, { sanitize: true }).process('<script>alert(1)</script>\n\n# Safe heading'));
  assert.doesNotMatch(rendered, /<script|alert\(1\)/i);
  assert.match(rendered, /<h1>Safe heading<\/h1>/);
});
