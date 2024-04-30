import { db } from "../config/database";
import { LinksHostsOutput } from "../protocols";
import { RowDataPacket } from "mysql2";

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

export async function getLinkHostsWithItems(){
    const [rows] = await db.query <RowDataPacket[]> (`
        SELECT hosts.hostid As hostid, hosts.name AS host_name, items.itemid As itemid, items.name AS item_name, groupid
        FROM hosts_groups
        JOIN hosts ON hosts_groups.hostid = hosts.hostid
        JOIN items ON items.hostid = hosts.hostid
        WHERE hosts_groups.groupid = ? AND items.name LIKE ?
        ORDER BY hosts.name ASC
    `,
    [216, '%ICMP ping%']
    );
    const typedResults: LinksHostsOutput[] = rows.map((row) => ({
        hostid: row.hostid,
        host_name: row.host_name,
        itemid: row.itemid,
        item_name: row.item_name,
        groupid: row.groupid,
    }));
    
    return typedResults;
}