import { db } from "@/config/database";
import axios from "axios";

const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';

export async function getEventsRepository() {
    const response = await db.query (
        `SELECT eventid, clock, name, FROM_UNIXTIME(clock) AS formatted_clock 
        FROM events 
        WHERE name LIKE ?
        ORDER BY eventid DESC;`,
        ['%Dellys - Imperial_Ceasa - MPLS: Unavailable by ICMP ping%']
    );
    return response;
}

export async function getObjectIdsRepository(hostId: string) {
    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'event.get',
        params: {
            output: ['name', 'objectid'],
            hostids: hostId,
            sortfield: 'objectid',
            sortorder: 'DESC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}

export async function getEventsByHostIdRepository(hostid: number, inicioT: number, fimT: number) {
    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'event.get',
        params: {
            output: ['eventid', 'objectid', 'name', 'clock', 'severity'],
            hostids: hostid,
            time_from: inicioT,
            time_till: fimT,
            sortfield: 'eventid',
            sortorder: 'ASC',
        },
        auth: authToken,
        id: 1,
    });
    return response.data.result;
}