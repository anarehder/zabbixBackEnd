import httpStatus from "http-status";
import { Request, Response } from "express";
import { getAlretsService } from "../services";

export async function getAlertsController(req: Request, res: Response) {
    try{
        const response = await getAlretsService(req.body);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}