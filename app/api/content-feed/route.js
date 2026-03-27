import { contentFeedStore } from '@/lib/data-store';

// GET /api/content-feed
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const creatorId = url.searchParams.get('creatorId');
    const verdict = url.searchParams.get('verdict');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let analyses = contentFeedStore.getAll();

    // Filter by creator if provided
    if (creatorId) {
      analyses = analyses.filter((a) => a.creatorId === creatorId);
    }

    // Filter by verdict if provided
    if (verdict) {
      analyses = analyses.filter((a) => a.verdict === verdict);
    }

    // Sort by analyzed date (newest first)
    analyses = analyses.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));

    // Apply limit
    analyses = analyses.slice(0, limit);

    return Response.json(
      {
        success: true,
        count: analyses.length,
        data: analyses,
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

// POST /api/content-feed
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.creatorId || !body.title || !body.verdict) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: creatorId, title, verdict',
        },
        { status: 400 }
      );
    }

    // Validate verdict
    const validVerdicts = ['Supported', 'Contradicted', 'Mixed', 'Insufficient Data'];
    if (!validVerdicts.includes(body.verdict)) {
      return Response.json(
        {
          success: false,
          error: `Invalid verdict. Must be one of: ${validVerdicts.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const newAnalysis = contentFeedStore.create({
      creatorId: body.creatorId,
      creatorName: body.creatorName || 'Unknown',
      title: body.title,
      claimText: body.claimText || '',
      contentUrl: body.contentUrl || '',
      publishedAt: body.publishedAt || new Date().toISOString(),
      verdict: body.verdict,
      verdictReason: body.verdictReason || '',
      supportedClaims: body.supportedClaims || [],
      contradictedClaims: body.contradictedClaims || [],
      insufficientDataClaims: body.insufficientDataClaims || [],
      marketDataUsed: body.marketDataUsed || [],
      confidenceScore: body.confidenceScore || 0.5,
      fearMongeringScore: body.fearMongeringScore || null,
    });

    return Response.json(
      {
        success: true,
        data: newAnalysis,
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
