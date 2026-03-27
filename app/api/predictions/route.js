import { predictionsStore } from '@/lib/data-store';

// GET /api/predictions
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const resolved = url.searchParams.get('resolved');

    let predictions = predictionsStore.getAll();

    // Filter by status if provided
    if (status) {
      predictions = predictions.filter((p) => p.status === status);
    }

    // Filter by resolved if provided
    if (resolved !== null) {
      const isResolved = resolved === 'true';
      predictions = predictions.filter((p) => p.resolved === isResolved);
    }

    return Response.json(
      {
        success: true,
        count: predictions.length,
        data: predictions,
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

// POST /api/predictions
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.marketSegment || !body.prediction) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: title, marketSegment, prediction',
        },
        { status: 400 }
      );
    }

    const newPrediction = predictionsStore.create({
      title: body.title,
      description: body.description || '',
      marketSegment: body.marketSegment,
      prediction: body.prediction,
      timeframe: body.timeframe || '',
      confidence: body.confidence || 0.5,
      rationale: body.rationale || '',
      expiresAt: body.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return Response.json(
      {
        success: true,
        data: newPrediction,
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
