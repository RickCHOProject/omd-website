// Supabase configuration for OMD platform
const SUPABASE_URL = 'https://wqvfsynpxfwacesvjlmd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L0SuigrNUZpsWC66KSVCOA_EuypYe5i';

export { SUPABASE_URL, SUPABASE_ANON_KEY };

// Helper for Supabase REST API calls
export async function supabaseQuery(table, { method = 'GET', body, select, filters, order, limit } = {}) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;

  const params = new URLSearchParams();
  if (select) params.set('select', select);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  if (order) params.set('order', order);
  if (limit) params.set('limit', limit.toString());

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  };

  if (method === 'POST' || method === 'PATCH') {
    headers['Prefer'] = 'return=representation';
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase ${method} ${table} failed: ${errorText}`);
  }

  // DELETE returns no content
  if (method === 'DELETE') return { success: true };

  return response.json();
}
