import { getHostGroupsController, getHostGroupsSubdivisionController, getHostGroupsLinks, getHostsController } from "../controllers/host-controller";
import { Router } from "express";

const hostRouter = Router();

hostRouter.get("/", getHostsController);
hostRouter.get("/groups", getHostGroupsController);
hostRouter.get("/groups/subdivision/:groupName", getHostGroupsSubdivisionController);
hostRouter.get("/groups/links/:groupName", getHostGroupsLinks);

export {hostRouter}