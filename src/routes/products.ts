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
