const cleanText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export const buildBuyerSignup = (input = {}) => {
  const name = cleanText(input.name, 120);
  const email = cleanText(input.email, 254).toLowerCase();
  const phone = cleanText(input.phone, 40);
  const markets = cleanText(input.markets, 500);

  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    name,
    email,
    phone,
    markets,
    source: 'OMD Signup Form'
  };
};

export const buildSupabaseSecretHeaders = (key) => ({
  apikey: key,
  ...(key.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${key}` })
});
