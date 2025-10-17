import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma-client';

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50),
});

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Ім'я користувача (мін. 2, макс. 50 символів)
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *                 description: Email користувача
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: Пароль (мін. 8 символів)
 *     responses:
 *       201:
 *         description: Користувач успішно створений
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Користувач уже існує
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Користувач вже існує"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Помилка реєстрації"
 */

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
