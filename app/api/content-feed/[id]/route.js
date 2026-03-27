import { contentFeedStore } from '@/lib/data-store';

// GET /api/content-feed/:id
export async function GET(request, { params }) {
  try {
    const analysis = contentFeedStore.getById(params.id);

    if (!analysis) {
      return Response.json(
        {
          success: false,
          error: 'Analysis not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: analysis,
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

// PATCH /api/content-feed/:id
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const updated = contentFeedStore.update(params.id, body);

    if (!updated) {
      return Response.json(
        {
          success: false,
          error: 'Analysis not found',
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

// DELETE /api/content-feed/:id
export async function DELETE(request, { params }) {
  try {
    const deleted = contentFeedStore.delete(params.id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          error: 'Analysis not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Analysis deleted',
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
