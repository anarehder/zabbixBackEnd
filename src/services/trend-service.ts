import { TrendsOutput } from "@/protocols";
import { getMonthTrendByItemIdRepository } from "@/repositories";
import { getTimestampsOfMonth } from "./manageTime-service";
import moment from "moment";

export async function getMonthTrendByItemIdService(itemid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const responseDB: TrendsOutput[] = await getMonthTrendByItemIdRepository(itemid, firstTimestamp, lastTimestamp);
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    return response;
}