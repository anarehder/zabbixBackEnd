import { getAlertsController, getAlertsDashboardController, getAllHostsAlertsController, getLastMonthAlertsController, getLastMonthAlertsDashController } from "../controllers";
import { validateBody } from "../middlewares";
import { getAlertsSchema } from "../schemas";
import { Router } from "express";

const alertsRouter = Router();

alertsRouter.post("/", validateBody(getAlertsSchema), getAlertsController);
alertsRouter.get("/relatorio/lista/:groupid", getLastMonthAlertsController);
alertsRouter.get("/realtorio/dash/:groupid", getLastMonthAlertsDashController);
alertsRouter.post("/allhosts", validateBody(getAlertsSchema), getAllHostsAlertsController);
alertsRouter.get("/dashboards/:groupId/:time", getAlertsDashboardController);

export {alertsRouter}