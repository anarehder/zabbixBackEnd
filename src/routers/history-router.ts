import { getLastValueHistoryController, getLinksFirewallController, getServersLinuxController } from "@/controllers";
import { Router } from "express";

const historyRouter = Router();

historyRouter.get("/links", getLastValueHistoryController);
historyRouter.get("/linksfirewall", getLinksFirewallController);
historyRouter.get("/serverslinux", getServersLinuxController);

export {historyRouter}