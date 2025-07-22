import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerConfig from "../swagger";
import productsRouter from "./routes/products";
import productIdRouter from "./routes/product-id";
import categoriesRouter from "./routes/categories";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

swaggerConfig(app);

app.use("/api/products", productsRouter);
app.use("/api/products/", productIdRouter);
app.use("/api/all_categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Products API!");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
