import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
    ) as { userId: number; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, fullName: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
