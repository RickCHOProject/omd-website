import { fetchAllSeries } from '@/lib/fred';
import { marketDataStore } from '@/lib/data-store';

/**
 * POST /api/refresh-market-data
 *
 * Fetches fresh data from the FRED API and updates the local data store.
 * Can be triggered manually, by a Vercel cron job, or by a webhook.
 *
 * Headers:
 *   Authorization: Bearer <REFRESH_SECRET> (optional, for production)
 *
 * Vercel cron config (add to vercel.json):
 *   { "crons": [{ "path": "/api/refresh-market-data", "schedule": "0 8 * * *" }] }
 */
export async function POST(request) {
  try {
    // Optional: verify auth in production
    const authHeader = request.headers.get('authorization');
    const refreshSecret = process.env.REFRESH_SECRET;

    if (refreshSecret && authHeader !== `Bearer ${refreshSecret}`) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for FRED API key before attempting fetch
    if (!process.env.FRED_API_KEY) {
      return Response.json(
        {
          success: false,
          error: 'FRED_API_KEY not configured. Get a free key at https://fred.stlouisfed.org/docs/api/api_key.html',
        },
        { status: 503 }
      );
    }

    console.log('[refresh-market-data] Starting FRED data fetch...');

    const { data, errors } = await fetchAllSeries();

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'All FRED series failed to fetch',
          errors,
        },
        { status: 502 }
      );
    }

    // Merge with existing data: update series we got, keep others
    const existing = marketDataStore.getAll();
    const updatedSeriesIds = new Set(data.map((d) => d.series));

    // Start with freshly fetched data
    const merged = [...data];

    // Add any existing series that weren't refreshed (keep stale data rather than lose it)
    for (const item of existing) {
      if (!updatedSeriesIds.has(item.series)) {
        merged.push(item);
      }
    }

    // Write the merged data back
    // We need to write directly since marketDataStore doesn't have a replaceAll method
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'market-data.json');
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');

    console.log(`[refresh-market-data] Updated ${data.length} series, ${errors.length} errors`);

    return Response.json(
      {
        success: true,
        updated: data.length,
        errors: errors.length > 0 ? errors : undefined,
        series: data.map((d) => d.series),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[refresh-market-data] Error:', error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel cron (crons hit GET by default)
export async function GET(request) {
  return POST(request);
}
