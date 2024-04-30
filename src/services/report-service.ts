import { getReportRepository } from "../repositories";

export async function getReportService(groupid: number, start: string, end: string) {
    const response = await getReportRepository(groupid, start, end);
    return response;
}
