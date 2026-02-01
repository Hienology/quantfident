import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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
