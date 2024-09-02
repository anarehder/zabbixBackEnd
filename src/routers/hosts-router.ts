import { getHostGroupsController, getHostsController } from "../controllers/host-controller";
import { Router } from "express";

const hostRouter = Router();

hostRouter.get("/", getHostsController);
hostRouter.get("/groups", getHostGroupsController);

export {hostRouter}