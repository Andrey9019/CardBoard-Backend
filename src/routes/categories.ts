import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma-client";

const router = Router();

interface CategoryConfigItem {
  name: string;
  display_name: string;
  model: any;
}

const categoryConfig: CategoryConfigItem[] = [
  { name: "genres", display_name: "Жанри", model: prisma.genre },
  { name: "types", display_name: "Типи", model: prisma.type },
  { name: "mechanics", display_name: "Механіки", model: prisma.mechanic },
  { name: "difficulty", display_name: "Складність", model: prisma.difficulty },
  {
    name: "player_count",
    display_name: "Кількість гравців",
    model: prisma.playerCount,
  },
  { name: "age_group", display_name: "Вікова група", model: prisma.ageGroup },
  { name: "duration", display_name: "Тривалість", model: prisma.duration },
  { name: "publisher", display_name: "Видавець", model: prisma.publisher },
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const categoryPromises = categoryConfig.map(({ model }) =>
      model.findMany({ select: { id: true, name: true } })
    );

    const categoryResults = await Promise.all(categoryPromises);

    const categories = categoryConfig.map(({ name, display_name }, index) => ({
      name,
      display_name,
      values: categoryResults[index],
    }));

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
