import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma-client";

const router = Router();

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Отримати деталі продукту за ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукту
 *     responses:
 *       200:
 *         description: Деталі продукту
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Унікальний ідентифікатор продукту
 *                 title:
 *                   type: string
 *                   description: Назва гри
 *                 description:
 *                   type: string
 *                   description: Опис гри
 *                 rules_summary:
 *                   type: string
 *                   description: Короткий опис правил гри
 *                 release_year:
 *                   type: string
 *                   description: Рік випуску гри
 *                 price:
 *                   type: number
 *                   description: Ціна гри
 *                 discount_price:
 *                   type: string
 *                   description: Ціна зі знижкою
 *                 stock:
 *                   type: integer
 *                   description: Кількість товару на складі
 *                 amount:
 *                   type: integer
 *                   nullable: true
 *                   description: Кількість (необов’язкове поле)
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Список URL-зображень гри
 *                 thumbnail:
 *                   type: string
 *                   description: URL до мініатюри гри
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Дата створення запису
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Дата оновлення запису
 *                 difficultyId:
 *                   type: integer
 *                   description: ID рівня складності
 *                 playerCountId:
 *                   type: integer
 *                   description: ID кількості гравців
 *                 ageGroupId:
 *                   type: integer
 *                   description: ID вікової групи
 *                 durationId:
 *                   type: integer
 *                   description: ID тривалості гри
 *                 publisherId:
 *                   type: integer
 *                   description: ID видавця
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   description: Жанри гри
 *                 types:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   description: Типи гри
 *                 mechanics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   description: Механіки гри
 *                 difficulty:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                   description: Рівень складності
 *                 player_count:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                   description: Кількість гравців
 *                 age_group:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                   description: Вікова група
 *                 duration:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                   description: Тривалість гри
 *                 publisher:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                   description: Видавець гри
 *       400:
 *         description: Некоректний формат ID
 *       404:
 *         description: Продукт не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          genres: true,
          types: true,
          mechanics: true,
          difficulty: true,
          player_count: true,
          age_group: true,
          duration: true,
          publisher: true,
        },
      });

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
