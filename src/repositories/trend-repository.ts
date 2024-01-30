import axios from "axios";

const apiUrl = "http://100.101.1.189/api_jsonrpc.php";
const authToken = '579099a2ea5c124912efa2b8c2bc0aa7338123beb0513aead603c2ebf4bff1cd';

export async function getMonthTrendByItemIdRepository(itemid: number, firstTimestamp: number, lastTimestamp:number) {

    const response = await axios.post(apiUrl, {
        jsonrpc: '2.0',
        method: 'trend.get',
        params: {
            output: 'extend',
            itemids: itemid,
            time_from: firstTimestamp,
            time_till: lastTimestamp,
            sortfield: 'clock',
            sortorder: 'ASC',
        },
        auth: authToken,
        id: 1,
    });

    return response.data.result;
}