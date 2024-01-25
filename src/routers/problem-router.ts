import { getProblemController } from "@/controllers";
import { Router } from "express";

const problemRouter = Router();

problemRouter.get("/", getProblemController);

export {problemRouter}