import httpStatus from "http-status";
import { Request, Response } from "express";
import { getAlertsDashboardService, getAllHostsAlretsService, getAlretsService } from "../services";

export async function getAlertsController(req: Request, res: Response) {
    try{
        const response = await getAlretsService(req.body);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getAllHostsAlertsController(req: Request, res: Response) {
    try{
        const response = await getAllHostsAlretsService(req.body);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getAlertsDashboardController(req: Request, res: Response) {
    const {groupId, time} = req.params;
    if (isNaN(Number(groupId))){
        return res.status(httpStatus.NOT_ACCEPTABLE).send("groupId as a string, it must be a number");
    }
    try{
        const response = await getAlertsDashboardService(Number(groupId), time)
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}