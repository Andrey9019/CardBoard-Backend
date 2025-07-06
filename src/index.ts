import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Ендпоінт /api/games
app.post("/api/games", async (req: Request, res: Response) => {
  try {
    const filters = req.body as { [key: string]: number[] };
    const games = await prisma.game.findMany({
      where: {
        categories: filters.genres
          ? { some: { categoryId: { in: filters.genres } } }
          : undefined,
      },
      include: { categories: true },
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Ендпоінт /api/games/all_categories
app.get("/api/games/all_categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { values: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
