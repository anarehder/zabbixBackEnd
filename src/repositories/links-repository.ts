import { RowDataPacket } from "mysql2";
import { db } from "../config/database";
import { LinksLatestProblems, LinksLatestValues } from "../protocols";

export async function getLinksValuesByGroupIdRepository(groupId: number) {
    const [rows] = await db.query<RowDataPacket[]>(`
    SELECT h.hostid AS hostId, 
        (SELECT interface.ip 
            FROM interface 
            WHERE interface.hostid = h.hostid 
            LIMIT 1) AS ip,  -- Subconsulta para pegar um único IP por host
        h.name AS hostName, 
        i.itemid AS itemId, 
        i.name AS itemName, 
        hg.groupid, 
        t1.value, 
        hi.location_lat AS lat,
        hi.location_lon AS lon,
        hi.notes AS notes,
        FROM_UNIXTIME(t1.clock) AS lastUpdate
    FROM hosts_groups hg
    JOIN hosts h ON hg.hostid = h.hostid
    JOIN items i ON i.hostid = h.hostid
    JOIN host_inventory hi ON h.hostid = hi.hostid
    JOIN history_uint t1 ON t1.itemid = i.itemid
    INNER JOIN (
        SELECT itemid, MAX(clock) AS max_clock
        FROM history_uint
        GROUP BY itemid
    ) t2 ON t1.itemid = t2.itemid AND t1.clock = t2.max_clock
    WHERE 
        hg.groupid = ? AND 
        i.name LIKE '%ICMP ping%'
    ORDER BY h.name ASC;`, 
    [groupId, '%ICMP ping%']);

    const typedResults: LinksLatestValues[] = rows.map((row) => ({
        hostId: row.hostId,
        ip: row.ip,
        hostName: row.hostName,
        itemId: row.itemId,
        itemName: row.itemName,
        groupid: row.groupId,
        value: row.value,
        lat: row.lat ? row.lat : "-",
        lon: row.lon ? row.lon : "-",
        notes: row.notes ? row.notes : "-",   
        lastUpdate: row.lastUpdate
    }));

    return typedResults;
}

export async function getLinksProblemsByGroupIpRepository(groupId: number) {
    const [rows] = await db.query<RowDataPacket[]>(`
    SELECT 
	    h.hostid as hostId, 
        (SELECT interface.ip 
            FROM interface 
            WHERE interface.hostid = h.hostid 
            LIMIT 1) AS ip,  -- Subconsulta para pegar um único IP por host
        h.name AS hostName, 
        i.itemid as itemId, 
        i.name as itemName, 
        hg.groupid as groupid,
        problem.name AS problemName,
        from_unixtime(problem.clock) as problemTime
    FROM hosts_groups hg
    JOIN hosts h ON hg.hostid = h.hostid
    JOIN items i ON i.hostid = h.hostid
    LEFT JOIN (
		SELECT MIN(itemid) AS min_itemid, triggerid
		FROM functions
		GROUP BY triggerid
	) AS functions ON functions.min_itemid = i.itemid
    JOIN problem ON problem.objectid = functions.triggerid
    WHERE 
        hg.groupid = ? AND 
        problem.name LIKE '%Unavailable by ICMP ping%' AND
        problem.r_eventid IS NULL
    ORDER BY problem.clock DESC;`, 
    [groupId, '%Unavailable by ICMP ping%']);

    const typedResults: LinksLatestProblems[] = rows.map((row) => ({
        hostId: row.hostId,
        ip: row.ip,
        hostName: row.hostName,
        itemId: row.itemId,
        itemName: row.itemName,
        groupid: row.groupid,
        problemName: row.problemName,
        problemTime: row.problemTime
    }));

    return typedResults;
}

export async function getLinksLastValuesByGroupIdLocationRepository(groupId: number, location: string){
    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT h.hostid, 
            (SELECT interface.ip 
                FROM interface 
                WHERE interface.hostid = h.hostid 
                LIMIT 1) AS ip,  -- Subconsulta para pegar um único IP por host
            h.name AS hostName, 
            TRIM(SUBSTRING_INDEX(host, '-', -1)) AS location,
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(host, '-', 2), '-', -1)) AS provider,
            i.itemid AS itemId, 
            i.name AS itemName, 
            hg.groupid, 
            t1.value,
            hi.location_lat AS lat,
			hi.location_lon AS lon,
			hi.notes AS notes,
            FROM_UNIXTIME(t1.clock) AS last_update
        FROM hosts_groups hg
        JOIN hosts h ON hg.hostid = h.hostid
        JOIN items i ON i.hostid = h.hostid
        JOIN history_uint t1 ON t1.itemid = i.itemid
        JOIN host_inventory hi ON h.hostid = hi.hostid
        INNER JOIN (
            SELECT itemid, MAX(clock) AS max_clock
            FROM history_uint
            GROUP BY itemid
        ) t2 ON t1.itemid = t2.itemid AND t1.clock = t2.max_clock
        WHERE hg.groupid = ?
        AND i.name LIKE ?
        AND h.name LIKE ?
        ORDER BY h.name ASC;`,
        [groupId, '%ICMP ping%',`%- ${location}%`]);

        const typedResults: LinksLatestValues[] = rows.map((row) => ({
            hostId: row.hostId,
            ip: row.interface,
            hostName: row.hostName,
            itemId: row.itemId,
            itemName: row.itemName,
            groupid: row.groupId,
            value: row.value,
            lat: row.lat ? row.lat : "-",
            lon: row.lon ? row.lon : "-",
            notes: row.notes ? row.notes : "-",   
            lastUpdate: row.lastUpdate,
            location: row.location,
            provider: row.provider            
        }));

        return typedResults;
}