#!/usr/bin/env node

/**
 * FRED API Data Aggregation Script
 * Fetches key economic indicators from FRED API
 * Run: node scripts/fetch-fred-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// FRED API configuration
const FRED_API_KEY = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// Key series to track
const FRED_SERIES = [
  {
    code: 'MORTGAGE30US',
    title: '30-Year Fixed Rate Mortgage Average',
    unit: 'percent',
    frequency: 'weekly',
  },
  {
    code: 'HOUST',
    title: 'Housing Starts',
    unit: 'thousands of units',
    frequency: 'monthly',
  },
  {
    code: 'PERMIT',
    title: 'Building Permits',
    unit: 'thousands of units',
    frequency: 'monthly',
  },
  {
    code: 'MSACSR',
    title: 'Months Supply of New Houses',
    unit: 'months',
    frequency: 'monthly',
  },
  {
    code: 'MSPUS',
    title: 'Median Sales Price of Existing Homes',
    unit: 'thousands of dollars',
    frequency: 'monthly',
  },
  {
    code: 'UNRATE',
    title: 'Unemployment Rate',
    unit: 'percent',
    frequency: 'monthly',
  },
];

async function fetchFREDSeries(seriesCode) {
  try {
    const url = new URL(FRED_BASE_URL);
    url.searchParams.set('series_id', seriesCode);
    url.searchParams.set('api_key', FRED_API_KEY);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'desc');
    url.searchParams.set('limit', '12'); // Last 12 observations

    console.log(`Fetching ${seriesCode}...`);
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`Failed to fetch ${seriesCode}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.observations || data.observations.length === 0) {
      console.warn(`No observations found for ${seriesCode}`);
      return null;
    }

    // Transform observations
    const observations = data.observations.map((obs) => ({
      date: obs.date,
      value: obs.value === '.' ? null : parseFloat(obs.value),
    }));

    // Calculate change from previous observation
    const withChange = observations.map((obs, idx) => {
      if (idx === 0 || observations[idx - 1].value === null || obs.value === null) {
        return { ...obs, change: null };
      }
      const change = obs.value - observations[idx - 1].value;
      return { ...obs, change: parseFloat(change.toFixed(2)) };
    });

    return withChange;
  } catch (error) {
    console.error(`Error fetching ${seriesCode}:`, error.message);
    return null;
  }
}

async function updateMarketData() {
  const marketData = [];

  for (const series of FRED_SERIES) {
    const observations = await fetchFREDSeries(series.code);
    if (observations) {
      marketData.push({
        id: `fred_${series.code}`,
        series: series.code,
        title: series.title,
        unit: series.unit,
        frequency: series.frequency,
        lastUpdate: new Date().toISOString(),
        data: observations,
      });
      // Rate limit: be nice to the API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (marketData.length > 0) {
    const dataPath = path.join(__dirname, '..', 'data', 'market-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(marketData, null, 2));
    console.log(`✓ Updated ${marketData.length} market data series`);
    return marketData;
  } else {
    console.error('No market data fetched. Check FRED_API_KEY.');
    return null;
  }
}

// Main execution
updateMarketData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
