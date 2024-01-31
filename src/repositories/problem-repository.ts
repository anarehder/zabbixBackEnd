import { db } from "@/config/database";
import axios from "axios";

const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';

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
    console.log(response.data.result);
    return response.data.result;
}