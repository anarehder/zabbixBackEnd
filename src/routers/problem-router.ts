import { getDayProblemsByHostidController, getProblemController } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getDayProblemsSchema } from "@/schemas/getDayProblems-schema";
import { Router } from "express";

const problemRouter = Router();

problemRouter.get("/", getProblemController);
problemRouter.post("/", validateBody(getDayProblemsSchema), getDayProblemsByHostidController);

export {problemRouter}