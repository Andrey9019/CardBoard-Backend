import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma-client";

const router = Router();

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
