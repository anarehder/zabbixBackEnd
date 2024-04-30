import { getLinkDailyTrendByItemIdController, getMonthTrendByItemIdController, getMonthlyAverageByItemIdController } from "../controllers";
import { validateBody } from "../middlewares";
import { getMonthTrendsSchema } from "../schemas/getMonthTrends-schema";
import { Router } from "express";

const trendRouter = Router();

trendRouter.post("/link/daily", validateBody(getMonthTrendsSchema), getMonthTrendByItemIdController);
trendRouter.post("/link/dailyreport", validateBody(getMonthTrendsSchema), getLinkDailyTrendByItemIdController);
trendRouter.post("/link/monthreport", validateBody(getMonthTrendsSchema), getMonthlyAverageByItemIdController);

export {trendRouter}