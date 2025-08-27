import httpStatus from "http-status";
import { Request, response, Response } from "express";
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

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Os meses começam do zero
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export async function getDBDataJSPecas(req: Request, res: Response) {
    const today = getTodayDate();
    try {
        const user = process.env.DENODO_USER;
        const password = process.env.DENODO_PASSWORD;

        // const url = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_db_items_jspecas?$format=json`;

        const urlUint = 'http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_dbitems_js_uint?$groupby=itemid&$select=itemid,first(host)%20as%20host,first(items_name)%20as%20items_name,first(itemid)%20as%20itemid,group_concat(value_max)%20as%20value,group_concat(clock)%20as%20clock,group_concat(date_br)%20as%20date_br&$filter=day=1&$format=json';

        const urlText = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_dbitems_js_text?&$groupby=itemid&$select=itemid,first(host)%20as%20host,first(items_name)%20as%20items_name,first(itemid)%20as%20itemid,first(date_br)%20as%20date_Br,first(clock)%20as%20clock,first(value)%20as%20value&$format=json`;
        
        const urlServ = 'http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_items_history_servidor_db_jspecas?$groupby=itemid&$select=itemid,first(host)%20as%20host,first(items_name)%20as%20items_name,first(itemid)%20as%20itemid,first(date_br)%20as%20date_br,first(clock)%20as%20clock,first(value)%20as%20value&$format=json';

        // console.log(url);
        // Create Basic Auth header
        const authString = btoa(`${user}:${password}`);

        const responseSpace = await axios.get(urlUint, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseSpace.status) {
            if (responseSpace.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseSpace.status}`);
        }

        const responseTables = await axios.get(urlText, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseTables.status) {
            if (responseTables.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseTables.status}`);
        }

        const responseServ = await axios.get(urlServ, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseServ.status) {
            if (responseServ.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseServ.status}`);
        }

        const response = {servidor: responseServ.data, tables: responseTables.data, space: responseSpace.data}
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}
