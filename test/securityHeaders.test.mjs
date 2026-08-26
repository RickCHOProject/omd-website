import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

test('every route receives the required browser security headers', async () => {
  const rules = await nextConfig.headers();
  const headers = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));

  assert.equal(nextConfig.poweredByHeader, false);
  assert.equal(rules[0].source, '/(.*)');
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.match(headers['Content-Security-Policy'], /object-src 'none'/);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
});
