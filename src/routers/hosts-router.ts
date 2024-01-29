import { getHostsController } from "@/controllers/host-controller";
import { Router } from "express";

const hostRouter = Router();

hostRouter.get("/", getHostsController);

export {hostRouter}