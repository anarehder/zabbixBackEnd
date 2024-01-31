import { getLinkDailyTrendByItemIdController, getMonthTrendByItemIdController } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getMonthTrendsSchema } from "@/schemas/getMonthTrends-schema";
import { Router } from "express";

const trendRouter = Router();

trendRouter.post("/link/daily", validateBody(getMonthTrendsSchema), getMonthTrendByItemIdController);
trendRouter.post("/link/dailyreport", validateBody(getMonthTrendsSchema), getLinkDailyTrendByItemIdController);

export {trendRouter}