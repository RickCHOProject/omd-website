import { creatorsStore, contentFeedStore } from '@/lib/data-store';

// GET /api/creators/:id
export async function GET(request, { params }) {
  try {
    const creator = creatorsStore.getById(params.id);

    if (!creator) {
      return Response.json(
        {
          success: false,
          error: 'Creator not found',
        },
        { status: 404 }
      );
    }

    // Get creator's recent analyses
    const recentAnalyses = contentFeedStore.getByCreator(params.id);

    return Response.json(
      {
        success: true,
        data: {
          ...creator,
          recentAnalyses: recentAnalyses.length,
          analyses: recentAnalyses,
        },
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

// PATCH /api/creators/:id
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const updated = creatorsStore.update(params.id, body);

    if (!updated) {
      return Response.json(
        {
          success: false,
          error: 'Creator not found',
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

// DELETE /api/creators/:id
export async function DELETE(request, { params }) {
  try {
    const deleted = creatorsStore.delete(params.id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          error: 'Creator not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Creator deleted',
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
