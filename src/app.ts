import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/database";

dotenv.config()

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export default app;
