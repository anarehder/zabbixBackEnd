import httpStatus from "http-status";
import { Request, Response } from "express";
import { getLastValueHistoryService, getLinksFirewallService, getLinksValuesProblemsService, getServersLinuxService, getServersWindowsService } from "../services";

export async function getLastValueHistoryController(req: Request, res: Response) {
    try{
        const response = await getLastValueHistoryService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getLinksValuesProblemsController(req: Request, res: Response) {
    const { groupId } = req.params;

    if (isNaN(Number(groupId))){
        return res.status(httpStatus.NOT_ACCEPTABLE).send("groupId as a string, it must be a number");
    }
    try{
        const response = await getLinksValuesProblemsService(Number(groupId));
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

export async function getServersWindowsController(req: Request, res: Response) {
    const {page} = req.params;
    if (isNaN(Number(page))){
        return res.status(httpStatus.BAD_REQUEST).send("Page must be a number!");
    }
    try{
        const response = await getServersWindowsService(Number(page));
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}