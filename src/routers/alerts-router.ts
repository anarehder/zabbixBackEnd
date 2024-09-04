import { getAlertsController } from "../controllers";
import { validateBody } from "../middlewares";
import { getAlertsSchema } from "../schemas";
import { Router } from "express";

const alertsRouter = Router();

alertsRouter.post("/", validateBody(getAlertsSchema), getAlertsController);

export {alertsRouter}