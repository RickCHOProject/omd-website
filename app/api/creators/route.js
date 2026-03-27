import { creatorsStore } from '@/lib/data-store';

// GET /api/creators
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    const sortBy = url.searchParams.get('sortBy') || 'credibilityScore';

    let creators = creatorsStore.getAll();

    // Filter by platform if provided
    if (platform) {
      creators = creators.filter((c) => c.platform === platform);
    }

    // Sort by specified field
    if (sortBy === 'credibilityScore') {
      creators.sort((a, b) => b.credibilityScore - a.credibilityScore);
    } else if (sortBy === 'followers') {
      creators.sort((a, b) => b.followers - a.followers);
    } else if (sortBy === 'fearMongeringIndex') {
      creators.sort((a, b) => a.fearMongeringIndex - b.fearMongeringIndex);
    }

    return Response.json(
      {
        success: true,
        count: creators.length,
        data: creators,
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

// POST /api/creators
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.platform || !body.handle) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: name, platform, handle',
        },
        { status: 400 }
      );
    }

    const newCreator = creatorsStore.create({
      name: body.name,
      platform: body.platform,
      handle: body.handle,
      profileUrl: body.profileUrl || '',
      bio: body.bio || '',
      followers: body.followers || 0,
      averageViews: body.averageViews || 0,
      joinedDate: body.joinedDate || new Date().toISOString().split('T')[0],
      verdict: body.verdict || 'Unrated',
    });

    return Response.json(
      {
        success: true,
        data: newCreator,
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
