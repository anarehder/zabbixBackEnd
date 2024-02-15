import { getLastValueHistoryController, getLinksFirewallController } from "@/controllers";
import { Router } from "express";

const historyRouter = Router();

historyRouter.get("/links", getLastValueHistoryController);
historyRouter.get("/linksfirewall", getLinksFirewallController);

export {historyRouter}