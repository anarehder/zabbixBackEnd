import { HistoryOutput } from "@/protocols";
import { getLastValueHistoryRepository } from "@/repositories";
import moment from "moment";

export async function getLastValueHistoryService() {
    const responseDB: HistoryOutput[] = await getLastValueHistoryRepository();
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    return response;
}
