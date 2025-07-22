import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import swaggerConfig from "../swagger";
import productsRouter from "./routes/products";
import productIdRouter from "./routes/product-id";
import categoriesRouter from "./routes/categories";

dotenv.config();
const app = express();

app.use(
  cors({ origin: ["https://card-board.vercel.app", "http://localhost:3000"] })
);

swaggerConfig(app);

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/products/", productIdRouter);
app.use("/api/all_categories", categoriesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
