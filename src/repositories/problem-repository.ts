import { RowDataPacket } from "mysql2";
import { db } from "../config/database";
import axios from "axios";
import { LinksLatestProblems } from "@/protocols";

const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';

export async function getLinksProblemsByGroupIpRepository(groupId: number) {
    const [rows] = await db.query<RowDataPacket[]>(`
    SELECT 
        hg.groupid as groupId,
        h.hostid as hostId, 
        (SELECT interface.ip 
            FROM interface 
            WHERE interface.hostid = h.hostid 
            LIMIT 1) AS interface,  -- Subconsulta para pegar um único IP por host
        h.name AS hostName, 
        i.itemid as itemId, 
        i.name as itemName, 
        problem.name as problemName,
        from_unixtime(problem.clock) as problemTime
    FROM hosts_groups hg
    JOIN hosts h ON hg.hostid = h.hostid
    JOIN items i ON i.hostid = h.hostid
    LEFT JOIN (
            SELECT MIN(itemid) AS min_itemid, triggerid
            FROM functions
            GROUP BY triggerid
        ) AS functions ON functions.min_itemid = i.itemid
    JOIN problem ON problem.objectid = functions.triggerid
    WHERE 
        hg.groupid = ? AND 
        problem.name LIKE ? AND 
        DATE(FROM_UNIXTIME(problem.clock)) >= ?
    ORDER BY problem.clock DESC;`, 
    [groupId, '%Unavailable by ICMP ping%', '2024-01-01']);

    const typedResults: LinksLatestProblems[] = rows.map((row) => ({
        hostId: row.hostId,
        ip: row.interface,
        hostName: row.hostName,
        itemId: row.itemId,
        itemName: row.itemName,
        groupid: row.groupId,
        problemName: row.problemName,
        problemTime: row.problemTime
    }));

    return typedResults;
}

export async function getProblemsRepository() {
    const response = await db.query (
    'SELECT * FROM problem WHERE name LIKE ?', ['%ICMP ping%']
    );
    return response;
}

export async function getProblemsByHostidRepository(hostid: number, firstTimestamp: number, lastTimestamp:number) {

    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'problem.get',
        params: {
            output: ['eventid', 'objectid', 'name', 'clock', 'severity'],
            hostids: hostid,
            time_from: firstTimestamp,
            time_till: lastTimestamp,
            sortfield: ["eventid"],
            sortorder: 'ASC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}

export async function getLastProblemByHostidRepository(hostid: number) {
    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'problem.get',
        params: {
            output: ['eventid', 'objectid', 'name', 'clock', 'severity'],
            hostids: hostid,
            limit: 1, // Adiciona o parâmetro limit para obter apenas o problema mais recente
            sortfield: ["eventid"],
            sortorder: 'DESC', // Altera para ordem decrescente
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result[0];
}

export async function getProblemsByHostidListRepository(hostid: number[]) {

    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'problem.get',
        params: {
            output: ['eventid', 'objectid', 'name', 'clock', 'severity'],
            hostids: hostid,
            sortfield: ["eventid"],
            sortorder: 'ASC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}