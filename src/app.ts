import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/database";
import { eventRouter, hostRouter, problemRouter } from "./routers";
import { itemRouter } from "./routers/item-router";

dotenv.config()

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/problem", problemRouter)
  .use("/item", itemRouter)
  .use("/host", hostRouter)
  .use("/event", eventRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export default app;
