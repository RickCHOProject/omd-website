import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createRateLimiter } from '../lib/rateLimit.mjs';
import { isSameOriginRequest } from '../lib/requestSecurity.mjs';
import { buildBuyerSignup, buildSupabaseSecretHeaders } from '../lib/signup.mjs';

test('buyer signups are validated, normalized, and source-locked', () => {
  assert.deepEqual(buildBuyerSignup({
    name: ' Buyer Name ',
    email: 'BUYER@EXAMPLE.COM',
    phone: ' 480-555-0100 ',
    markets: ' Arizona, Texas ',
    source: 'attacker-controlled'
  }), {
    name: 'Buyer Name',
    email: 'buyer@example.com',
    phone: '480-555-0100',
    markets: 'Arizona, Texas',
    source: 'OMD Signup Form'
  });

  assert.equal(buildBuyerSignup({ name: 'Buyer', email: 'invalid', phone: '480' }), null);
  assert.equal(buildBuyerSignup({ name: 'Buyer', email: 'buyer@example.com', phone: '' }), null);
});

test('new Supabase secret keys are never placed in a bearer header', () => {
  assert.deepEqual(buildSupabaseSecretHeaders('sb_secret_example'), { apikey: 'sb_secret_example' });
  assert.deepEqual(buildSupabaseSecretHeaders('legacy.jwt.key'), {
    apikey: 'legacy.jwt.key',
    Authorization: 'Bearer legacy.jwt.key'
  });
});

test('signup limiter blocks excess requests inside the window', () => {
  const allow = createRateLimiter();
  assert.equal(allow({ key: 'one', limit: 1, windowMs: 1000, now: 0 }), true);
  assert.equal(allow({ key: 'one', limit: 1, windowMs: 1000, now: 1 }), false);
  assert.equal(allow({ key: 'one', limit: 1, windowMs: 1000, now: 1000 }), true);
});

test('the public signup route no longer contains a publishable database key', async () => {
  const source = await readFile(new URL('../app/api/signup/route.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /sb_publishable_/);
  assert.match(source, /SUPABASE_SECRET_KEY/);
});

const fakeRequest = ({ origin, fetchSite } = {}) => ({
  url: 'https://www.offmarketdaily.com/api/signup',
  headers: { get: (name) => name === 'origin' ? origin || null : name === 'sec-fetch-site' ? fetchSite || null : null }
});

test('buyer signup accepts same-origin requests and rejects cross-site requests', () => {
  assert.equal(isSameOriginRequest(fakeRequest({ origin: 'https://www.offmarketdaily.com', fetchSite: 'same-origin' })), true);
  assert.equal(isSameOriginRequest(fakeRequest({ origin: 'https://evil.example' })), false);
  assert.equal(isSameOriginRequest(fakeRequest({ fetchSite: 'cross-site' })), false);
});
