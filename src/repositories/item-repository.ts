import { db } from "@/config/database";

export async function getItemsRepository(hostid: number) {
    console.log("cheguei no rep");
    const response = await db.query (
        `SELECT itemid, hostid, name, key_, delay, history, trends, units
        FROM items 
        WHERE hostid = ?
        ORDER BY name DESC;`,
        [hostid]
    );
    return response[0];
}