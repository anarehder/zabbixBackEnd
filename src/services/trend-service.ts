import { TrendsOutput } from "@/protocols";
import { getMonthTrendByItemIdRepository } from "@/repositories";
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

function getTimestampsOfMonth(month: string) {
    const parsedMonth = new Date(`${month}-01`);
    const days = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 0).getDate();

    const dataMoment = moment(`${month}-01`);
    const firstTimestamp = dataMoment.valueOf()/1000;
    const lastTimestamp = firstTimestamp + (days*24*60*60);

    return { firstTimestamp, lastTimestamp };
}