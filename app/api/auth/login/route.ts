import { NextRequest, NextResponse } from 'next/server';
import { generateAuthToken } from '@/lib/site-auth';

const SITE_USERNAME = process.env.SITE_USERNAME || 'mfl';
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'replit';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    if (id !== SITE_USERNAME || password !== SITE_PASSWORD) {
      return NextResponse.json({ error: 'ID 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const token = await generateAuthToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set('site_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: '요청을 처리할 수 없습니다.' }, { status: 400 });
  }
}
