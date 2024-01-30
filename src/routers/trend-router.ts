import { getMonthTrendByItemIdController } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getMonthTrendsSchema } from "@/schemas/getMonthTrends-schema";
import { Router } from "express";

const trendRouter = Router();

trendRouter.post("/month", validateBody(getMonthTrendsSchema), getMonthTrendByItemIdController);

export {trendRouter}