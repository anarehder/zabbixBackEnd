import { getProblemsByHostidRepository, getProblemsRepository } from "@/repositories";
import { getTimestampsOfDay, getTimestampsOfMonth } from "./manageTime-service";
import moment from "moment";
import { EventDBOutput } from "@/protocols";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response[0];
}

export async function getProblemsByHostidService(hostid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const responseDB: EventDBOutput[] = await getProblemsByHostidRepository(hostid, firstTimestamp, lastTimestamp);
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss'),
    }));
    const problemObject = {problem: response[0]};
    return problemObject;
}