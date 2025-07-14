import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import productIdRouter from "./routes/product-id";
import categoriesRouter from "./routes/categories";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/product/:id", productIdRouter);
app.use("/api/all_categories", categoriesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
