import httpStatus from "http-status";
import { Request, Response } from "express";
import { getEventService, getObjectIdsService } from "@/services/event-service";

export async function getEventController(req: Request, res: Response) {
    try{
        const response = await getEventService();
        return res.status(httpStatus.OK).send(response);
    } catch(error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function getObjectIds(req: Request, res: Response) {
    const hostid: string = req.body.hostid;
    // Função para fazer solicitação à API do Zabbix
    try {
        const response = await getObjectIdsService(hostid);
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error('Erro durante a solicitação à API do Zabbix:', error.response.data);
        throw error;
    }
}