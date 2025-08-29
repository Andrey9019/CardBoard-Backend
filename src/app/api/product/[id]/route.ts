import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
