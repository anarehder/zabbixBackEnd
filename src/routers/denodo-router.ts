import { monthSchema } from "../schemas";
import { validateBody } from "../middlewares";
import { Router } from "express";
import { getDBDataJSPecas, getFirewallJSPecas, getJiraJSPecas, getLinksJSPecas } from "../controllers";

const denodoRouter = Router();

denodoRouter.post("/monitoramento/links/jspecas", validateBody(monthSchema), getLinksJSPecas);
denodoRouter.post("/monitoramento/firewall/jspecas", validateBody(monthSchema), getFirewallJSPecas);
denodoRouter.get("/monitoramento/db/jspecas", getDBDataJSPecas);
denodoRouter.post("/monitoramento/jira/jspecas", validateBody(monthSchema), getJiraJSPecas);


export {denodoRouter}