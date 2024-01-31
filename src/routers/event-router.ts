import { getEventController, getEventsByHostIdController, getObjectIds } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getItemsSchema } from "@/schemas";
import { getMonthProblemsSchema } from "@/schemas/getMonthProblems-schema";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/", getEventController);
eventRouter.post("/objectid", validateBody(getItemsSchema), getObjectIds);
eventRouter.post("/", validateBody(getMonthProblemsSchema), getEventsByHostIdController);

export {eventRouter}