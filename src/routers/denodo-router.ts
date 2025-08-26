import { monthSchema } from "../schemas";
import { validateBody } from "../middlewares";
import { Router } from "express";
import { getDBDataJSPecas, getLinksJSPecas } from "../controllers";

const denodoRouter = Router();

denodoRouter.post("/monitoramento/links/jspecas", validateBody(monthSchema), getLinksJSPecas);
denodoRouter.post("/monitoramento/db/jspecas", getDBDataJSPecas);

export {denodoRouter}