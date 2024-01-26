import { db } from "@/config/database";

export async function getProblemsRepository() {
    const response = await db.query (
    'SELECT * FROM problem WHERE name LIKE ?', ['%ICMP ping loss%']
    );
    return response;
}