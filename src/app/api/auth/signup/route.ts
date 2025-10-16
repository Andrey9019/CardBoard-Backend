import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma-client';

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50),
});

export async function POST(req: Request) {
  try {
    const { email, password, name } = signupSchema.parse(await req.json());

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Користувач вже існує' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName: name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { user: { email: user.email, name: user.fullName } },
      { status: 201 },
    );
  } catch (error) {
    console.error('Singup error:', error);
    return NextResponse.json(
      { error: 'Невірний email або пароль' },
      { status: 500 },
    );
  }
}
