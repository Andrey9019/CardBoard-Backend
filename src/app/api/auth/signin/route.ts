import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma-client';

const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Логін користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успішний логін
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *       401:
 *         description: Невірний email або пароль
 *       500:
 *         description: Внутрішня помилка сервера
 */

export async function POST(req: Request) {
  try {
    const { email, password } = signinSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 401 },
      );
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Невірний пароль' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    return NextResponse.json(
      {
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Невірний email або пароль' },
      { status: 500 },
    );
  }
}
