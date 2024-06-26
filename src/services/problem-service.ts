import { getProblemsByHostidRepository, getProblemsRepository } from "../repositories";
import { getTimestampsOfDay, getTimestampsOfMonth } from "./manageTime-service";
import moment from "moment";
import { EventsOutput } from "../protocols";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response[0];
}

export async function getProblemsByHostidService(hostid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const responseDB: EventsOutput[] = await getProblemsByHostidRepository(hostid, firstTimestamp, lastTimestamp);
    const response = responseDB
    .filter(item => item.name.includes('Unavailable by ICMP ping'))
    .map(item => ({
        ...item,
        formatted_clock: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    const problemObject = {problem: response};
    return problemObject;
}