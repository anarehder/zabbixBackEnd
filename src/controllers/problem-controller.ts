import httpStatus from "http-status";
import { Request, Response } from "express";
import { getProblemsByHostidService, getProblemService } from "@/services";

export async function getProblemController(req: Request, res: Response) {
    try{
        const response = await getProblemService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getProblemsByHostidController(req: Request, res: Response) {
    const hostid: number = req.body.hostid;
    const month: string = req.body.month;
    try {
        const response = await getProblemsByHostidService(hostid, month);
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error('Erro durante a solicitação à API do Zabbix:', error.response.data);
        throw error;
    }
}