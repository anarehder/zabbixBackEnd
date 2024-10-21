import httpStatus from "http-status";
import { Request, Response } from "express";
import { getLinksLiveByLocationService, getLinksLiveService } from "../services";

export async function getLinksLiveController(req: Request, res: Response) {
    const groupId: number = Number(req.params.groupId);
    if (isNaN(groupId)){
        return res.status(httpStatus.NOT_ACCEPTABLE).send("groupId as a string, it must be a number");
    }
    try{
        const response = await getLinksLiveService(groupId);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getLinksLiveByLocationController(req: Request, res: Response) {
    const groupId: number = Number(req.params.groupId);
    if (isNaN(groupId)){
        return res.status(httpStatus.NOT_ACCEPTABLE).send("groupId as a string, it must be a number");
    }
    if (groupId === 216 || groupId === 588){
        try{
            const response = await getLinksLiveByLocationService(groupId);
            return res.status(httpStatus.OK).send(response);
        } catch(error) {
            return res.status(httpStatus.BAD_REQUEST).send(error);
        }
    } else {
        return res.status(httpStatus.NOT_ACCEPTABLE).send("This groupId does not match this route");
    }
    
}

