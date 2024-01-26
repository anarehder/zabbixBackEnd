import { getEventController } from "@/controllers";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/", getEventController);

export {eventRouter}