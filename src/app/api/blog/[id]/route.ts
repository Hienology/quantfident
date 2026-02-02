import { NextRequest, NextResponse } from 'next/server';
import { BlogDbService } from '@/lib/services/blog-db-service';
import { requireAdmin, extractTokenFromHeader } from '@/lib/auth/server-auth';

// GET /api/blog/[id] - Get specific post (for admin editing)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if user is admin (optional for viewing)
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      await requireAdmin(token); // Only admins can view drafts
    }

    const post = await BlogDbService.getPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update post (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Extract and verify admin token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Require admin access
    await requireAdmin(token);

    const body = await request.json();
    const updates: Record<string, unknown> = { ...body };

    // Regenerate slug if title changed
    if (updates.title && typeof updates.title === 'string') {
      updates.slug = BlogDbService.generateSlug(updates.title);
    }

    // Recalculate reading time if content changed
    if (updates.content && typeof updates.content === 'string') {
      updates.readingTime = BlogDbService.calculateReadingTime(updates.content);
    }

    // Handle publish status
    if (updates.status && typeof updates.status === 'string') {
      updates.status = updates.status.toUpperCase();
      if (updates.status === 'PUBLISHED' && !updates.publishedAt) {
        updates.publishedAt = new Date();
      }
    }

    await BlogDbService.updatePost(id, updates);
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete post (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Extract and verify admin token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Require admin access
    await requireAdmin(token);

    await BlogDbService.deletePost(id);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}