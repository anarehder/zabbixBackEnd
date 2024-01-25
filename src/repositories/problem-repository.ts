import { db } from "@/config/database";
import { ProblemsOutput } from "@/protocols";

export async function getProblemsRepository() {
    const response = await db.query(`
    SELECT * FROM problem WHERE name LIKE '%ICMP ping loss%'
    `);
    return response;
}