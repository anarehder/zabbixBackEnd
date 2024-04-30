import httpStatus from "http-status";
import { Request, Response } from "express";
import { getHostsService } from "../services";

export async function getHostsController(req: Request, res: Response) {
    try{
        const response = await getHostsService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}