import { getProblemsRepository } from "@/repositories";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response[0];
}