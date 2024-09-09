import httpStatus from "http-status";
import { Request, Response } from "express";
import { getHostGroupsLinksService, getHostGroupsService, getHostGroupsSubdivisionService, getHostsService } from "../services";

export async function getHostsController(req: Request, res: Response) {
    try{
        const response = await getHostsService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getHostGroupsController(req: Request, res: Response) {
    try{
        const response = await getHostGroupsService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getHostGroupsSubdivisionController(req: Request, res: Response) {
    const {groupName} = req.params;
    try{
        const response = await getHostGroupsSubdivisionService(groupName);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getHostGroupsLinks(req: Request, res: Response) {
    const {groupName} = req.params;
    try{
        const response = await getHostGroupsLinksService(groupName);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}