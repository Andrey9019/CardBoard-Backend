import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

interface CategoryConfigItem {
  name: string;
  display_name: string;
  model: any;
}

const categoryConfig: CategoryConfigItem[] = [
  { name: 'genres', display_name: 'Жанри', model: prisma.genre },
  { name: 'types', display_name: 'Типи', model: prisma.type },
  { name: 'mechanics', display_name: 'Механіки', model: prisma.mechanic },
  { name: 'difficulty', display_name: 'Складність', model: prisma.difficulty },
  {
    name: 'player_count',
    display_name: 'Кількість гравців',
    model: prisma.playerCount,
  },
  { name: 'age_group', display_name: 'Вікова група', model: prisma.ageGroup },
  { name: 'duration', display_name: 'Тривалість', model: prisma.duration },
  { name: 'publisher', display_name: 'Видавець', model: prisma.publisher },
];

/**
 * @swagger
 * /api/all_categories:
 *   get:
 *     summary: Отримати всі категорії
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорій для фільтрації
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Ім'я категорії (наприклад, genres, types)
 *                   display_name:
 *                     type: string
 *                     description: Відображуване ім'я категорії (наприклад, Жанри)
 *                   values:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                       description: Значення категорії (наприклад, Фентезі для genres)
 *       500:
 *         description: Внутрішня помилка сервера
 */

export async function GET() {
  try {
    const categoryPromises = categoryConfig.map(({ model }) =>
      model.findMany({ select: { id: true, name: true } }),
    );

    const categoryResults = await Promise.all(categoryPromises);

    const categories = categoryConfig.map(({ name, display_name }, index) => ({
      name,
      display_name,
      values: categoryResults[index],
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
