import { NextResponse } from "next/server";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Card&Board API",
      version: "1.0.0",
      description: "API для інтернет-магазину настільних ігор Card&Board",
    },
    servers: [{ url: "http://localhost:3001" }],
  },
  apis: ["./src/app/**/*.ts"],
};

const specs = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(specs);
}
