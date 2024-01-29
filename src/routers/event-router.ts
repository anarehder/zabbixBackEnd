import { getEventController, getObjectIds } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getItemsSchema } from "@/schemas";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/", getEventController);
eventRouter.post("/objectid", validateBody(getItemsSchema), getObjectIds);

export {eventRouter}