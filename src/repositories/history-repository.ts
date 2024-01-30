import axios from "axios";

export async function getLastValueHistoryRepository(hostidsList: number[]) {
    const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
    const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';
    const currentTime = Math.floor(Date.now() / 1000);  // Obter o timestamp atual em segundos
    const timestamp119SecondsAgo = currentTime - 150;
    console.log(timestamp119SecondsAgo);

    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'history.get',
        params: {
            output: 'extend',
            hostids: hostidsList,
            time_from: timestamp119SecondsAgo,
            sortfield: 'clock',
            sortorder: 'DESC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}