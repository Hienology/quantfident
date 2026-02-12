import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin, extractTokenFromHeader } from '@/lib/auth/server-auth';
import { blogLimiter, getUserIdentifier } from '@/lib/middleware/rate-limit';

const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const adminUser = await requireAdmin(token);
    const rateLimitKey = getUserIdentifier(request.headers, adminUser.uid);
    const rateLimitResult = blogLimiter.check(rateLimitKey);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), MAX_LIMIT) : 50;

    const supabaseServer = getSupabaseServer();
    let query = supabaseServer
      .from('comments')
      .select('id, post_id, user_id, body, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (postId) {
      query = query.eq('post_id', postId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json({ comments: data ?? [] });
  } catch (error) {
    console.error('Comments list error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
