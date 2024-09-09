import { getReportRepository } from "../repositories";

export async function getReportService(groupId: number, start: string, end: string) {
    const response = await getReportRepository(groupId, start, end);
    return response;
}
