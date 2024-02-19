import httpStatus from "http-status";
import { Request, Response } from "express";
import { getLastValueHistoryService, getLinksFirewallService, getServersLinuxService } from "@/services";

export async function getLastValueHistoryController(req: Request, res: Response) {
    try{
        const response = await getLastValueHistoryService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getLinksFirewallController(req: Request, res: Response) {
    try{
        const response = await getLinksFirewallService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getServersLinuxController(req: Request, res: Response) {
    try{
        const response = await getServersLinuxService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}