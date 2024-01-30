import httpStatus from "http-status";
import { Request, Response } from "express";
import { getMonthTrendByItemIdService } from "@/services";

export async function getMonthTrendByItemIdController(req: Request, res: Response) {
    const itemid: number = req.body.itemid;
    const month: string = req.body.month;
    try {
        const response = await getMonthTrendByItemIdService(itemid, month);
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error('Erro durante a solicitação à API do Zabbix:', error.response.data);
        throw error;
    }
}