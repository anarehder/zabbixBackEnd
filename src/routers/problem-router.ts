import { getProblemsByHostidController, getProblemController } from "../controllers";
import { validateBody } from "../middlewares";
import { getMonthProblemsSchema } from "../schemas/getMonthProblems-schema";
import { Router } from "express";

const problemRouter = Router();

problemRouter.get("/", getProblemController);
problemRouter.post("/", validateBody(getMonthProblemsSchema), getProblemsByHostidController);

export {problemRouter}