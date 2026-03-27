/**
 * FRED (Federal Reserve Economic Data) API Client
 * https://fred.stlouisfed.org/docs/api/
 *
 * Free API key: https://fred.stlouisfed.org/docs/api/api_key.html
 * Rate limit: 120 requests/minute
 */

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// Series we track for the OMD Market Dashboard
// Each entry: { id, title, unit, frequency, transform }
export const TRACKED_SERIES = [
  {
    id: 'MORTGAGE30US',
    title: '30-Year Fixed Rate Mortgage',
    unit: 'percent',
    frequency: 'weekly',
    category: 'rates',
  },
  {
    id: 'MORTGAGE15US',
    title: '15-Year Fixed Rate Mortgage',
    unit: 'percent',
    frequency: 'weekly',
    category: 'rates',
  },
  {
    id: 'DFF',
    title: 'Federal Funds Effective Rate',
    unit: 'percent',
    frequency: 'daily',
    category: 'rates',
  },
  {
    id: 'MSPUS',
    title: 'Median Sales Price of Existing Homes',
    unit: 'thousands of dollars',
    frequency: 'quarterly',
    category: 'pricing',
  },
  {
    id: 'CSUSHPINSA',
    title: 'Case-Shiller Home Price Index',
    unit: 'index',
    frequency: 'monthly',
    category: 'pricing',
  },
  {
    id: 'HOUST',
    title: 'Housing Starts',
    unit: 'thousands of units',
    frequency: 'monthly',
    category: 'supply',
  },
  {
    id: 'PERMIT',
    title: 'Building Permits',
    unit: 'thousands of units',
    frequency: 'monthly',
    category: 'supply',
  },
  {
    id: 'MSACSR',
    title: 'Months of Supply',
    unit: 'months',
    frequency: 'monthly',
    category: 'supply',
  },
  {
    id: 'UNRATE',
    title: 'Unemployment Rate',
    unit: 'percent',
    frequency: 'monthly',
    category: 'macro',
  },
  {
    id: 'CPIAUCSL',
    title: 'Consumer Price Index (CPI)',
    unit: 'index',
    frequency: 'monthly',
    category: 'macro',
  },
];

/**
 * Fetch observations for a FRED series
 * @param {string} seriesId - FRED series ID (e.g., 'MORTGAGE30US')
 * @param {object} options - { limit, sortOrder, startDate }
 * @returns {Promise<object>} - { observations: [...], meta: {...} }
 */
export async function fetchFredSeries(seriesId, options = {}) {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    throw new Error('FRED_API_KEY environment variable is not set. Get a free key at https://fred.stlouisfed.org/docs/api/api_key.html');
  }

  const {
    limit = 12,
    sortOrder = 'desc',
    startDate = null,
  } = options;

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: sortOrder,
    limit: String(limit),
  });

  if (startDate) {
    params.set('observation_start', startDate);
  }

  const url = `${FRED_BASE_URL}/series/observations?${params}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    // Cache for 1 hour in production
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`FRED API error (${response.status}): ${text}`);
  }

  const json = await response.json();

  if (!json.observations) {
    throw new Error(`FRED API returned unexpected response for ${seriesId}`);
  }

  return json.observations;
}

/**
 * Transform raw FRED observations into our market-data format
 * @param {string} seriesId - FRED series ID
 * @param {Array} observations - Raw FRED observations
 * @returns {Array} - Formatted data points
 */
export function transformObservations(seriesId, observations) {
  // Filter out missing values (FRED uses '.' for missing)
  const valid = observations.filter(
    (obs) => obs.value !== '.' && obs.value !== null && obs.value !== undefined
  );

  return valid.map((obs, index) => {
    const value = parseFloat(obs.value);

    // Calculate change from previous observation
    let change = null;
    if (index < valid.length - 1) {
      const prevValue = parseFloat(valid[index + 1].value);
      if (!isNaN(prevValue) && prevValue !== 0) {
        change = parseFloat((value - prevValue).toFixed(2));
      }
    }

    return {
      date: obs.date,
      value: parseFloat(value.toFixed(2)),
      change,
    };
  });
}

/**
 * Fetch and format a single market data series
 * @param {object} seriesConfig - Entry from TRACKED_SERIES
 * @returns {Promise<object>} - Formatted market data object
 */
export async function fetchAndFormatSeries(seriesConfig) {
  const observations = await fetchFredSeries(seriesConfig.id, {
    limit: 12,
    sortOrder: 'desc',
  });

  const data = transformObservations(seriesConfig.id, observations);

  return {
    id: `fred_${seriesConfig.id}`,
    series: seriesConfig.id,
    title: seriesConfig.title,
    unit: seriesConfig.unit,
    frequency: seriesConfig.frequency,
    category: seriesConfig.category,
    lastUpdate: new Date().toISOString(),
    source: 'FRED',
    data,
  };
}

/**
 * Fetch all tracked series. Returns results for all that succeed,
 * logs errors for any that fail. Does not throw on partial failure.
 * @returns {Promise<{ data: Array, errors: Array }>}
 */
export async function fetchAllSeries() {
  const results = await Promise.allSettled(
    TRACKED_SERIES.map((config) => fetchAndFormatSeries(config))
  );

  const data = [];
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      data.push(result.value);
    } else {
      errors.push({
        series: TRACKED_SERIES[index].id,
        error: result.reason?.message || 'Unknown error',
      });
    }
  });

  return { data, errors };
}
