import { db } from "@/config/database";

export async function getEventsRepository() {
    const response = await db.query (
        `SELECT eventid, clock, name, FROM_UNIXTIME(clock) AS formatted_clock 
        FROM events 
        WHERE name LIKE ?
        ORDER BY eventid DESC;`,
        ['%Dellys - Imperial_Ceasa - MPLS: Unavailable by ICMP ping%']
    );
    return response;
}