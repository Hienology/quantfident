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

    const { email, password } = await request.json();

    // Mock validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Mock authentication - Admin user
    if (email === 'tribd.tec@gmail.com' && password === 'AdminTest123!@') {
      // Admin successful login
      return NextResponse.json({
        message: 'Đăng nhập thành công',
        user: {
          id: 'admin-001',
          email: 'tribd.tec@gmail.com',
          name: 'Admin User',
          role: 'admin',
          emailVerified: true
        },
        // Mock admin session token
        token: 'mock-admin-jwt-token-abc123xyz'
      });
    }

    // Mock authentication - Test user
    if (email === 'test@example.com' && password === 'password123') {
      // Mock successful login
      return NextResponse.json({
        message: 'Đăng nhập thành công',
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          emailVerified: false
        },
        // Mock session token
        token: 'mock-jwt-token-12345'
      });
    }

    // Mock failed login
    return NextResponse.json(
      { error: 'Thông tin đăng nhập không hợp lệ' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
