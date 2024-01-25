import httpStatus from "http-status";
import { Request, Response } from "express";
import { getProblemService } from "@/services";

export async function getProblemController(req: Request, res: Response) {
    try{
        const response = await getProblemService();
        return res.status(httpStatus.OK).send(response[0]);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}