export async function POST(request) {
  const SUPABASE_URL = 'https://wqvfsynpxfwacesvjlmd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_L0SuigrNUZpsWC66KSVCOA_EuypYe5i';

  try {
    const data = await request.json();
    const { name, email, phone, markets, source } = data;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/buyer_signups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: name || '',
        email: email || '',
        phone: phone || '',
        markets: markets || '',
        source: source || 'OMD Website'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      return Response.json({ error: 'Failed to save' }, { status: 500 });
    }

    const result = await response.json();
    return Response.json({ success: true, data: result });

  } catch (err) {
    console.error('Signup API error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
