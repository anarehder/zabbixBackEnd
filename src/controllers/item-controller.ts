import httpStatus from "http-status";
import { Request, Response } from "express";
import { getItemsService } from "@/services";

export async function getItemsController(req: Request, res: Response) {
    const hostid = Number(req.body.hostid);
    try{
        const response = await getItemsService(hostid);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}