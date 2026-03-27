import { predictionsStore } from '@/lib/data-store';

// GET /api/predictions/:id
export async function GET(request, { params }) {
  try {
    const prediction = predictionsStore.getById(params.id);

    if (!prediction) {
      return Response.json(
        {
          success: false,
          error: 'Prediction not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: prediction,
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

// PATCH /api/predictions/:id
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const updated = predictionsStore.update(params.id, body);

    if (!updated) {
      return Response.json(
        {
          success: false,
          error: 'Prediction not found',
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

// DELETE /api/predictions/:id
export async function DELETE(request, { params }) {
  try {
    const deleted = predictionsStore.delete(params.id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          error: 'Prediction not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Prediction deleted',
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
