import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma-client";

const router = Router();
// Тип для параметрів запиту
interface QueryParams {
  query?: string;
  genres?: string | string[];
  types?: string | string[];
  mechanics?: string | string[];
  difficulty?: string | string[];
  player_count?: string | string[];
  age_group?: string | string[];
  duration?: string | string[];
  publisher?: string | string[];
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Отримати список усіх продуктів
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Пошуковий запит для фільтрації за назвою продукту
 *       - in: query
 *         name: genres
 *         schema:
 *           type: string
 *         description: Список ID жанрів, розділених комами (наприклад, "1,2,3")
 *       - in: query
 *         name: types
 *         schema:
 *           type: string
 *         description: Список ID типів, розділених комами (наприклад, "1,2")
 *       - in: query
 *         name: mechanics
 *         schema:
 *           type: string
 *         description: Список ID механік, розділених комами (наприклад, "1,2")
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *         description: Список ID рівнів складності, розділених комами
 *       - in: query
 *         name: player_count
 *         schema:
 *           type: string
 *         description: Список ID кількості гравців, розділених комами
 *       - in: query
 *         name: age_group
 *         schema:
 *           type: string
 *         description: Список ID вікових груп, розділених комами
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: Список ID тривалості гри, розділених комами
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *         description: Список ID видавців, розділених комами
 *     responses:
 *       200:
 *         description: Список продуктів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Унікальний ідентифікатор продукту
 *                   title:
 *                     type: string
 *                     description: Назва гри
 *                   description:
 *                     type: string
 *                     description: Опис гри
 *                   rules_summary:
 *                     type: string
 *                     description: Короткий опис правил гри
 *                   release_year:
 *                     type: string
 *                     description: Рік випуску гри
 *                   price:
 *                     type: number
 *                     description: Ціна гри
 *                   discount_price:
 *                     type: string
 *                     description: Ціна зі знижкою
 *                   stock:
 *                     type: integer
 *                     description: Кількість товару на складі
 *                   amount:
 *                     type: integer
 *                     nullable: true
 *                     description: Кількість (необов’язкове поле)
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Список URL-зображень гри
 *                   thumbnail:
 *                     type: string
 *                     description: URL до мініатюри гри
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Дата створення запису
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Дата оновлення запису
 *                   difficultyId:
 *                     type: integer
 *                     description: ID рівня складності
 *                   playerCountId:
 *                     type: integer
 *                     description: ID кількості гравців
 *                   ageGroupId:
 *                     type: integer
 *                     description: ID вікової групи
 *                   durationId:
 *                     type: integer
 *                     description: ID тривалості гри
 *                   publisherId:
 *                     type: integer
 *                     description: ID видавця
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     description: Жанри гри
 *                   types:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     description: Типи гри
 *                   mechanics:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     description: Механіки гри
 *                   difficulty:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                     description: Рівень складності
 *                   player_count:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                     description: Кількість гравців
 *                   age_group:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                     description: Вікова група
 *                   duration:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                     description: Тривалість гри
 *                   publisher:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                     description: Видавець гри
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get(
  "/",
  async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    try {
      const {
        query,
        genres,
        types,
        mechanics,
        difficulty,
        player_count,
        age_group,
        duration,
        publisher,
      } = req.query;

      const genresArray = genres
        ? (Array.isArray(genres) ? genres : genres.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const typesArray = types
        ? (Array.isArray(types) ? types : types.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const mechanicsArray = mechanics
        ? (Array.isArray(mechanics) ? mechanics : mechanics.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const difficultyArray = difficulty
        ? (Array.isArray(difficulty) ? difficulty : difficulty.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const playerCountArray = player_count
        ? (Array.isArray(player_count) ? player_count : player_count.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const ageGroupArray = age_group
        ? (Array.isArray(age_group) ? age_group : age_group.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const durationArray = duration
        ? (Array.isArray(duration) ? duration : duration.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];
      const publisherArray = publisher
        ? (Array.isArray(publisher) ? publisher : publisher.split(","))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];

      const products = await prisma.product.findMany({
        where: {
          AND: [
            query
              ? { title: { contains: String(query), mode: "insensitive" } }
              : {},
            genresArray.length
              ? { genres: { some: { id: { in: genresArray } } } }
              : {},
            typesArray.length
              ? { types: { some: { id: { in: typesArray } } } }
              : {},
            mechanicsArray.length
              ? { mechanics: { some: { id: { in: mechanicsArray } } } }
              : {},
            difficultyArray.length
              ? { difficultyId: { in: difficultyArray } }
              : {},
            playerCountArray.length
              ? { playerCountId: { in: playerCountArray } }
              : {},
            ageGroupArray.length ? { ageGroupId: { in: ageGroupArray } } : {},
            durationArray.length ? { durationId: { in: durationArray } } : {},
            publisherArray.length
              ? { publisherId: { in: publisherArray } }
              : {},
          ],
        },
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

      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
