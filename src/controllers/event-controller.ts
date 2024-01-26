import httpStatus from "http-status";
import { Request, Response } from "express";
import { getEventService } from "@/services/event-service";

export async function getEventController(req: Request, res: Response) {
    try{
        const response = await getEventService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}