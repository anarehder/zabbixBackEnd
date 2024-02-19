import { getLastValueHistoryController, getLinksFirewallController, getServersLinuxController, getServersWindowsController } from "@/controllers";
import { Router } from "express";

const historyRouter = Router();

historyRouter.get("/links", getLastValueHistoryController);
historyRouter.get("/linksfirewall", getLinksFirewallController);
historyRouter.get("/serverslinux", getServersLinuxController);
historyRouter.get("/serverswindows/:page", getServersWindowsController);

export {historyRouter}