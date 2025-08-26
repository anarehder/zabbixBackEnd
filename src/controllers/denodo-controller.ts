import httpStatus from "http-status";
import { Request, Response } from "express";
import axios from "axios";

export async function getLinksJSPecas(req: Request, res: Response) {
    const month: string = req.body.month;
    console.log(month);
    try {
        const user = process.env.DENODO_USER;
        const password = process.env.DENODO_PASSWORD;

        // Create date range: first day of selected month to first day of next month
        const startDate = `${month}-01`;
        const nextMonthDate = new Date(month + '-01');
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const endDate = nextMonthDate.toISOString().slice(0, 10);

        const url = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_trendsglobo_registro_br?$format=json&$groupby=itemid&$select=itemid,avg(value_min),avg(value_max),first(host),first(items_name)&$filter=date_time%3E%3D%27${startDate}%27&$filter=date_time%3C%27${endDate}%27`;
        console.log(url);
        // Create Basic Auth header
        const authString = btoa(`${user}:${password}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!response.status) {
            if (response.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return res.status(httpStatus.OK).send(response.data);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getDBDataJSPecas(req: Request, res: Response) {

    try {
        const user = process.env.DENODO_USER;
        const password = process.env.DENODO_PASSWORD;

        const url = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_db_items_jspecas?$format=json`;
        console.log(url);
        // Create Basic Auth header
        const authString = btoa(`${user}:${password}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!response.status) {
            if (response.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return res.status(httpStatus.OK).send(response.data);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}
