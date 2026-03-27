import { marketDataStore } from '@/lib/data-store';

// GET /api/market-data/:id
export async function GET(request, { params }) {
  try {
    const all = marketDataStore.getAll();
    const marketData = all.find((m) => m.id === params.id);

    if (!marketData) {
      return Response.json(
        {
          success: false,
          error: 'Market data not found',
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

// PATCH /api/market-data/:id
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const updated = marketDataStore.update(params.id, body);

    if (!updated) {
      return Response.json(
        {
          success: false,
          error: 'Market data not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: updated,
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

// DELETE /api/market-data/:id
export async function DELETE(request, { params }) {
  try {
    const deleted = marketDataStore.delete(params.id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          error: 'Market data not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Market data deleted',
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
