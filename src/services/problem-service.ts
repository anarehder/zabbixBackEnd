import { getProblemsByHostidRepository, getProblemsRepository } from "@/repositories";
import { getTimestampsOfDay } from "./manageTime-service";
import moment from "moment";
import { EventDBOutput } from "@/protocols";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response[0];
}

export async function getDayProblemsByHostidService(itemid: number, day: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfDay(day);
    const responseDB: EventDBOutput[] = await getProblemsByHostidRepository(itemid, firstTimestamp, lastTimestamp);
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss'),
    }));
    return response;
}