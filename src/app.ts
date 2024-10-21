import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/database";
import { alertsRouter, eventRouter, historyRouter, hostRouter, linksRouter, problemRouter, reportRouter } from "./routers";
import { itemRouter } from "./routers/item-router";
import { trendRouter } from "./routers/trend-router";

dotenv.config()

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/alerts", alertsRouter)
  .use("/trend", trendRouter)
  .use("/problem", problemRouter)
  .use("/item", itemRouter)
  .use("/host", hostRouter)
  .use("/history", historyRouter)
  .use("/links", linksRouter)
  .use("/event", eventRouter)
  .use("/report", reportRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export default app;
