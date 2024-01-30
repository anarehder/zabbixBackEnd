import { getLastValueHistoryController } from "@/controllers";
import { Router } from "express";

const historyRouter = Router();

historyRouter.get("/", getLastValueHistoryController);

export {historyRouter}