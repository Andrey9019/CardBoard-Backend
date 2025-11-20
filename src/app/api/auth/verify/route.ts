// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma-client';

// export async function POST(req: Request) {
//     const cookie = req.headers.get('cookie');
//   try {
//     const { token } = await req.json();
//     // const body = await req.json();
//     // let token = body.token;
//     // let { token } = await req.json();

// // if (!token) {
//       // const cookie = req.headers.get('cookie');
//       // token = cookie?.match(/auth-token=([^;]+)/)?.[1];
//     // }

//     if (!token) {
//       return NextResponse.json({ error: 'No token' }, { status: 401 });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'fallback-secret',
//     ) as { userId: number };

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: { id: true, fullName: true, email: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     return NextResponse.json({ user });
//   } catch (error) {
//     console.error('Verify token error:', error);
//     return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//   }
// }


import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  const token = cookie?.match(/auth-token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true },
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
