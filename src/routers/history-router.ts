import { getLastValueHistoryController, getLinksFirewallController, getServersLinuxController, getServersWindowsController, getLinksValuesProblemsController } from "../controllers";
import { Router } from "express";

const historyRouter = Router();

historyRouter.get("/links", getLastValueHistoryController);
historyRouter.get("/links/:groupId", getLinksValuesProblemsController);
historyRouter.get("/linksfirewall", getLinksFirewallController);
historyRouter.get("/serverslinux", getServersLinuxController);
historyRouter.get("/serverswindows/:page", getServersWindowsController);

export {historyRouter}