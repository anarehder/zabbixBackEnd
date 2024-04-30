import { getItemsController } from "../controllers";
import { validateBody } from "../middlewares";
import { getItemsSchema } from "../schemas";
import { Router } from "express";

const itemRouter = Router();

itemRouter.get("/", validateBody(getItemsSchema), getItemsController);

export {itemRouter}