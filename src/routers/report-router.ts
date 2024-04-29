import { getReportController } from "@/controllers";
import { validateBody } from "@/middlewares";
import { getReportSchema } from "@/schemas";
import { Router } from "express";

const reportRouter = Router();

reportRouter.post("/", validateBody(getReportSchema), getReportController);

export {reportRouter}