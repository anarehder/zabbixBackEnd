import { db } from "../config/database";
import { hostGroupsInfo, LinksHostsOutput, LinksLatestValues } from "../protocols";
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

export async function getHostGroupsRepository() {
    const [rows] = await db.query <RowDataPacket[]>(
        `SELECT groupid, name, uuid
        FROM hstgrp 
        WHERE name NOT LIKE ?
        ORDER BY name ASC;`,
        ['%/%']
    );
    
    const typedResults: hostGroupsInfo[] = rows.map((row) => ({
        groupId: row.groupid,
        groupName: row.name,
        uuid: row.uuid
    }));
    
    return typedResults;
}

export async function getHostGroupsSubdivisionRepository(groupName: string) {
    const [rows] = await db.query <RowDataPacket[]>(
        `SELECT groupid, name, uuid
        FROM hstgrp 
        WHERE name LIKE ? AND name LIKE ?
        ORDER BY name ASC;`,
        [`%${groupName}%`,'%/%']
    );
    
    const typedResults: hostGroupsInfo[] = rows.map((row) => ({
        groupId: row.groupid,
        groupName: row.name,
        uuid: row.uuid
    }));
    
    return typedResults;
}

export async function getHostGroupsLinksRepository(groupName: string) {
    const [rows] = await db.query <RowDataPacket[]>(
        `SELECT groupid, name, uuid
        FROM hstgrp 
        WHERE name LIKE ? AND name LIKE ?
        ORDER BY name ASC;`,
        [`%${groupName}%`,'%LINK%']
    );

    const typedResults: hostGroupsInfo[] = rows.map((row) => ({
        groupId: row.groupid,
        groupName: row.name,
        uuid: row.uuid
    }));
    
    return typedResults;
}

export async function getLinksLatestValuesByGroupIdRepository (groupId: number){
    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT 
            h.hostid, 
            (SELECT interface.ip 
                FROM interface 
                WHERE interface.hostid = h.hostid 
                LIMIT 1) AS Interface,
            h.name AS host_name, 
            i.itemid, 
            i.name AS item_name, 
            hg.groupid, 
            t1.value, 
        FROM_UNIXTIME(t1.clock) AS last_update
        FROM hosts_groups hg
        JOIN hosts h ON hg.hostid = h.hostid
        JOIN items i ON i.hostid = h.hostid
        JOIN history_uint t1 ON t1.itemid = i.itemid
        INNER JOIN (
            SELECT itemid, MAX(clock) AS max_clock
            FROM history_uint
            GROUP BY itemid
        ) t2 ON t1.itemid = t2.itemid AND t1.clock = t2.max_clock
        WHERE 
            hg.groupid = ? AND 
            i.name LIKE ?
        ORDER BY h.name ASC;
        `,
        [groupId, '%ICMP ping%']);

    const typedResults: LinksLatestValues[] = rows.map((row) => ({
        hostId: row.hostid,
        ip: row.Interface,
        hostName: row.host_name,
        itemId: row.itemid,
        itemName: row.item_name,
        groupid: row.groupid,
        value: row.value,
        lastUpdate: row.last_update
    }));

    return typedResults;
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