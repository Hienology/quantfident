import { NextRequest, NextResponse } from 'next/server';
import { authLimiter, getClientIdentifier } from '@/lib/middleware/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIp = getClientIdentifier(request.headers);
    const rateLimitResult = authLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
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

    const { email, password, name } = await request.json();

    // Mock validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Mock email uniqueness check
    if (email === 'existing@example.com') {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      );
    }

    // Mock successful registration
    return NextResponse.json(
      {
        message: 'Đăng ký thành công',
        user: { id: '123', email, name }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
