import { predictionsStore } from '@/lib/data-store';

/**
 * Grade prediction API
 * POST /api/predictions/grade
 * Body: { predictionId, actualOutcome, verdict, accuracy }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.predictionId || !body.actualOutcome || !body.verdict) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: predictionId, actualOutcome, verdict',
        },
        { status: 400 }
      );
    }

    // Verify valid verdict
    const validVerdicts = ['Correct', 'Incorrect', 'Partial', 'Too Early'];
    if (!validVerdicts.includes(body.verdict)) {
      return Response.json(
        {
          success: false,
          error: `Invalid verdict. Must be one of: ${validVerdicts.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Calculate accuracy score
    let accuracy = 0;
    if (body.verdict === 'Correct') {
      accuracy = 1.0;
    } else if (body.verdict === 'Partial') {
      accuracy = 0.5;
    } else if (body.verdict === 'Incorrect') {
      accuracy = 0.0;
    }

    const graded = predictionsStore.update(body.predictionId, {
      actualOutcome: body.actualOutcome,
      resolved: true,
      verdict: body.verdict,
      accuracy,
      gradedAt: new Date().toISOString(),
      status: 'resolved',
    });

    if (!graded) {
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
        data: graded,
        message: `Prediction graded as ${body.verdict}. Accuracy score: ${accuracy}`,
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
