import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database";
import competitionRoutes from "./routes/competition.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/competitions", competitionRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "feedants-api",
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();