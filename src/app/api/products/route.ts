import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma-client";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const genres = searchParams.get("genres")?.split(",") || [];
    const types = searchParams.get("types")?.split(",") || [];
    const mechanics = searchParams.get("mechanics")?.split(",") || [];
    const difficulty = searchParams.get("difficulty")?.split(",") || [];
    const player_count = searchParams.get("player_count")?.split(",") || [];
    const age_group = searchParams.get("age_group")?.split(",") || [];
    const duration = searchParams.get("duration")?.split(",") || [];
    const publisher = searchParams.get("publisher")?.split(",") || [];

    const genresArray = genres.map(Number).filter((id) => !isNaN(id));
    const typesArray = types.map(Number).filter((id) => !isNaN(id));
    const mechanicsArray = mechanics.map(Number).filter((id) => !isNaN(id));
    const difficultyArray = difficulty.map(Number).filter((id) => !isNaN(id));
    const playerCountArray = player_count
      .map(Number)
      .filter((id) => !isNaN(id));
    const ageGroupArray = age_group.map(Number).filter((id) => !isNaN(id));
    const durationArray = duration.map(Number).filter((id) => !isNaN(id));
    const publisherArray = publisher.map(Number).filter((id) => !isNaN(id));

    const products = await prisma.product.findMany({
      where: {
        AND: [
          query ? { title: { contains: query, mode: "insensitive" } } : {},
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
          publisherArray.length ? { publisherId: { in: publisherArray } } : {},
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
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
