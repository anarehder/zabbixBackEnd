import { monthSchema } from "../schemas";
import { validateBody } from "../middlewares";
import { Router } from "express";
import { getLinksJSPecas } from "../controllers";

const denodoRouter = Router();

denodoRouter.post("/monitoramento/links/jspecas", validateBody(monthSchema), getLinksJSPecas);

export {denodoRouter}