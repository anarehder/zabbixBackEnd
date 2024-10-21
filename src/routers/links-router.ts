import { getLinkDailyTrendByItemIdController, getLinksLiveByLocationController, getLinksLiveController, getMonthlyAverageByItemIdController, getMonthTrendByItemIdController } from "../controllers";
import { validateBody } from "../middlewares";
import { getMonthTrendsSchema } from "../schemas/getMonthTrends-schema";
import { Router } from "express";

const linksRouter = Router();

linksRouter.post("/report/trends/daily", validateBody(getMonthTrendsSchema), getLinkDailyTrendByItemIdController);
linksRouter.post("/report/trends/monthly", validateBody(getMonthTrendsSchema), getMonthTrendByItemIdController)
linksRouter.post("/report/problem", validateBody(getMonthTrendsSchema),getMonthlyAverageByItemIdController);
linksRouter.get("/live/all/:groupId", getLinksLiveController);
linksRouter.get("/live/location/:groupId", getLinksLiveByLocationController);

export {linksRouter}