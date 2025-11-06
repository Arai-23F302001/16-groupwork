import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// ルート設定
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
