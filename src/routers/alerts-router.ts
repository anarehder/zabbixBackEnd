import { getAlertsController, getAllHostsAlertsController } from "../controllers";
import { validateBody } from "../middlewares";
import { getAlertsSchema } from "../schemas";
import { Router } from "express";

const alertsRouter = Router();

alertsRouter.post("/", validateBody(getAlertsSchema), getAlertsController);
alertsRouter.post("/allhosts", validateBody(getAlertsSchema), getAllHostsAlertsController);

export {alertsRouter}