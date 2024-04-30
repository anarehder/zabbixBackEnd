import httpStatus from "http-status";
import { Request, Response } from "express";
import { getReportService } from "../services";

export async function getReportController(req: Request, res: Response) {
    const { groupid, start, end }  = req.body;
    try{
        const response = await getReportService(groupid, start, end);
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}