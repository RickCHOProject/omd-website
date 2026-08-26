import { buildBuyerSignup, buildSupabaseSecretHeaders } from '../../../lib/signup.mjs';
import { createRateLimiter, getRequestIp } from '../../../lib/rateLimit.mjs';

const SUPABASE_URL = 'https://wqvfsynpxfwacesvjlmd.supabase.co';
const PRODUCTION_HOSTS = new Set(['offmarketdaily.com', 'www.offmarketdaily.com']);
const allowSignup = createRateLimiter();

export async function POST(request) {
  try {
    const requestHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(':')[0];
    if (!PRODUCTION_HOSTS.has(requestHost)) {
      return Response.json({ success: false, skipped: 'non-production' });
    }

    const signup = buildBuyerSignup(await request.json());
    if (!signup) return Response.json({ error: 'Enter a valid name, email, and phone.' }, { status: 400 });

    if (!allowSignup({
      key: `signup:${getRequestIp(request)}`,
      limit: 5,
      windowMs: 60 * 60 * 1000
    })) {
      return Response.json({ error: 'Please try again later.' }, { status: 429 });
    }

    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!secretKey) {
      return Response.json({ error: 'Signup is temporarily unavailable.' }, { status: 503 });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/buyer_signups`, {
      method: 'POST',
      headers: {
        ...buildSupabaseSecretHeaders(secretKey),
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      cache: 'no-store',
      body: JSON.stringify(signup)
    });

    if (!response.ok) {
      console.error('Buyer signup database request failed with status:', response.status);
      return Response.json({ error: 'Signup is temporarily unavailable.' }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Buyer signup failed:', error);
    return Response.json({ error: 'Signup is temporarily unavailable.' }, { status: 500 });
  }
}
