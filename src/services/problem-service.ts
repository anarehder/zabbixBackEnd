import { getDayProblemsByHostidRepository, getProblemsRepository } from "@/repositories";
import { getTimestampsOfDay } from "./manageTime-service";
import moment from "moment";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response[0];
}

export async function getDayProblemsByHostidService(itemid: number, day: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfDay(day);
    const responseDB: any[] = await getDayProblemsByHostidRepository(itemid, firstTimestamp, lastTimestamp);
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss'),
        R_clock_formatado: moment.unix(Number(item.r_clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    return response;
}