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

        const url = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_trendsglobo_registro_br?$format=json&$groupby=itemid&$select=itemid,avg(value_min),avg(value_max),first(host),first(items_name)&$filter=date_time%3E%3D%27${startDate}%27%20AND%20date_time%3C%27${endDate}%27`;
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

export async function getFirewallJSPecas(req: Request, res: Response) {
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

        const url = `http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_trends_firewall?$format=json&$groupby=itemid&$select=itemid,avg(value_min),avg(value_max),first(host),first(items_name)&$filter=date_time%3E%3D%27${startDate}%27%20AND%20date_time%3C%27${endDate}%27`;
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
        
        const urlServ = 'http://100.101.1.13:9090/denodo-restfulws/zabbix/views/dv_hosts_db_servidor_js?$format=json';

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


export async function getJiraJSPecas(req: Request, res: Response) {
    const month: string = req.body.month;
    console.log(month);
    try {
        const user = process.env.DENODO_USER;
        const password = process.env.DENODO_PASSWORD;
        const authString = btoa(`${user}:${password}`);
        // Create date range: first day of selected month to first day of next month
        const startDate = `${month}-01`;
        const nextMonthDate = new Date(month + '-01');
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const endDate = nextMonthDate.toISOString().slice(0, 10);

        const urlW =`http://100.101.1.13:9090/denodo-restfulws/jira/views/dv_js_worklogs_80d?$format=json&$groupby=ISSUE_ID&$select=ISSUE_ID,group_concat(distinct(ISSUE_KEY))%20as%20key,group_concat(distinct(UPDATED))%20as%20updated,group_concat(distinct(AUTHOR_NAME))%20as%20authors,group_concat(distinct(date_br))%20as%20created,SUM(LOGGED_TIME)%20as%20total&$orderby=ISSUE_ID&$filter=date_br%3C%27${endDate}%27%20and%20date_br%3E%3D%27${startDate}%27`;
        console.log(urlW);        

        const responseWorklogs = await axios.get(urlW, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseWorklogs.status) {
            if (responseWorklogs.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseWorklogs.status}`);
        }

        const urlL =`http://100.101.1.13:9090/denodo-restfulws/jira/views/bv_jira_80d_fields_jspecas?$format=json`;

        const responseList = await axios.get(urlL, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseList.status) {
            if (responseList.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseList.status}`);
        }

         const urlC =`http://100.101.1.13:9090/denodo-restfulws/jira/views/dv_jira_contratos?$format=json&$filter=%22Cliente_10117%22like%27%25JS%25%27`;

        const responseContratos = await axios.get(urlC, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            }
        });
        // console.log(response.data);
        if (!responseContratos.status) {
            if (responseContratos.status === 401) {
                throw new Error('Credenciais inválidas. Verifique usuário e senha.');
            }
            throw new Error(`Erro na requisição: ${responseContratos.status}`);
        }

        const response = {worklogs: responseWorklogs.data, list: responseList.data, contratos: responseContratos.data};
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}