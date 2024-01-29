import { db } from "@/config/database";

export async function getHostsRepository() {
    const response = await db.query (
        `SELECT hostid, host, name, name_upper
        FROM hosts 
        WHERE name LIKE ?
        ORDER BY name DESC;`,
        ['Dellys%']
    );
    return response[0];
}