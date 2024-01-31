import { getEventController, getLinkDailyReportByHostIdController, getLinkEventsByHostIdController, getObjectIds } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getItemsSchema } from "@/schemas";
import { getMonthProblemsSchema } from "@/schemas/getMonthProblems-schema";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/", getEventController);
eventRouter.post("/objectid", validateBody(getItemsSchema), getObjectIds);
eventRouter.post("/links", validateBody(getMonthProblemsSchema), getLinkEventsByHostIdController);
eventRouter.post("/dailyreport/links", validateBody(getMonthProblemsSchema), getLinkDailyReportByHostIdController);

export {eventRouter}