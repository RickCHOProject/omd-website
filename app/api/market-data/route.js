import { marketDataStore } from '@/lib/data-store';

// GET /api/market-data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const series = url.searchParams.get('series');

    if (series) {
      // Get specific series
      const marketData = marketDataStore.getBySeries(series);

      if (!marketData) {
        return Response.json(
          {
            success: false,
            error: `Market data series '${series}' not found`,
          },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          data: marketData,
        },
        { status: 200 }
      );
    }

    // Get all market data
    const allData = marketDataStore.getAll();

    return Response.json(
      {
        success: true,
        count: allData.length,
        data: allData,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/market-data
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.series || !body.title) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: series, title',
        },
        { status: 400 }
      );
    }

    const newData = marketDataStore.create({
      series: body.series,
      title: body.title,
      unit: body.unit || '',
      frequency: body.frequency || 'monthly',
      data: body.data || [],
    });

    return Response.json(
      {
        success: true,
        data: newData,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
