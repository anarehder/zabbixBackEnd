import { getAlertsController, getAlertsDashboardController, getAlertsPMZController, getAletsJSPecasController, getAllHostsAlertsController, getLastMonthAlertsController, getLastMonthAlertsDashController } from "../controllers";
import { validateBody } from "../middlewares";
import { getAlertsSchema } from "../schemas";
import { Router } from "express";

const alertsRouter = Router();

alertsRouter.post("/", validateBody(getAlertsSchema), getAlertsController);
alertsRouter.get("/relatorio/lista/:groupId", getLastMonthAlertsController);
alertsRouter.get("/relatorio/dash/:groupId", getLastMonthAlertsDashController);
alertsRouter.get("/relatorio/jspecas", getAletsJSPecasController);
alertsRouter.get("/relatorio/pmz", getAlertsPMZController);
alertsRouter.post("/allhosts", validateBody(getAlertsSchema), getAllHostsAlertsController);
alertsRouter.get("/dashboards/:groupId/:time", getAlertsDashboardController);

export {alertsRouter}