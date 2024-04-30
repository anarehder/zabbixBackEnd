import axios from "axios";
import { db } from "../config/database";
import { RowDataPacket } from "mysql2";

const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';

export async function getLastValueHistoryRepository(hostidsList: number[]) {
    const currentTime = Math.floor(Date.now() / 1000);  // Obter o timestamp atual em segundos
    const lastTime = currentTime - 300;

    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'history.get',
        params: {
            output: 'extend',
            hostids: hostidsList,
            time_from: lastTime,
            sortfield: 'itemid',
            sortorder: 'ASC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}

export async function getHostsLinksFirewallRepository(){
    const response = await db.query<RowDataPacket[]>(`
    SELECT 
    hstgrp.groupid,
    hstgrp.name AS groupName,
    hosts_groups.hostid,
    hosts.host,
    items.itemid,
    items.name,
    items.units,
    items.delay
    FROM 
        hstgrp
    JOIN 
        hosts_groups ON hstgrp.groupid = hosts_groups.groupid
    JOIN 
        hosts ON hosts_groups.hostid = hosts.hostid
    JOIN
        items ON items.hostid = hosts.hostid
    WHERE 
        hstgrp.name LIKE ? AND items.name LIKE ? AND items.name LIKE ?
    ORDER BY hosts.host ASC
    `,
    ['DELLYS/FW','%Interface port%','%Bits%']
    );

    return response[0];
}

export async function getValuesUINTRespository(itemid: number) {
    const response = await db.query<RowDataPacket[]>(`
        SELECT 
            FROM_UNIXTIME(history_uint.clock) AS formatted_clock, 
            history_uint.value
        FROM 
            history_uint
        JOIN 
            items ON history_uint.itemid = items.itemid 
        JOIN
            hosts ON items.hostid = hosts.hostid
        WHERE
            history_uint.itemid = ${itemid} AND FROM_UNIXTIME(history_uint.clock) >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
        ORDER BY formatted_clock ASC;
    `,
    );

    return response[0];
}

export async function getHostsServersRepository(server: string){
    const response = await db.query<RowDataPacket[]>(`
    SELECT 
        hstgrp.groupid,
        hstgrp.name AS groupName,
        hosts_groups.hostid,
        hosts.host,
        items.itemid,
        items.name,
        items.units,
        items.delay
    FROM 
        hstgrp
    JOIN 
        hosts_groups ON hstgrp.groupid = hosts_groups.groupid
    JOIN 
        hosts ON hosts_groups.hostid = hosts.hostid
    JOIN
        items ON items.hostid = hosts.hostid
    WHERE 
        hstgrp.name LIKE ? AND items.name = ? 
    ORDER BY 
        hosts.host ASC;
    `,
    [`DELLYS/SRV_${server}`,'ICMP ping']
    );

    return response[0];
}