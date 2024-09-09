import { db } from "../config/database";

export async function getDayAlertsRepository(groupId: number, date_interval: string, limit: number) {
    const response = await db.query (
        `SELECT
            hosts.name AS Host,
            MAX(interface.ip) AS Interface,
            events.name AS Alerta,
            CASE 
                WHEN events.severity = 2 THEN 'Warning'
                WHEN events.severity = 3 THEN 'Average'
                WHEN events.severity = 4 THEN 'High'
                WHEN events.severity = 5 THEN 'Disaster'
                ELSE 'Outro' 
            END AS Severidade,
            COUNT(DISTINCT events.eventid) AS Total, -- Contando cada evento apenas uma vez
            hstgrp.name AS groupName,
            events.severity AS event_severity,
            GROUP_CONCAT(DISTINCT FROM_UNIXTIME(events.clock)) AS event_times,
            GROUP_CONCAT(DISTINCT events.eventid) AS event_ids,
            GROUP_CONCAT(DISTINCT items.name) AS items,            
            GROUP_CONCAT(DISTINCT CONCAT(items.description, ' ', triggers.comments)) AS items_descrip     
        FROM
            events 
        LEFT JOIN (
            SELECT MIN(itemid) AS min_itemid, triggerid
            FROM functions
            GROUP BY triggerid
        ) AS functions ON functions.triggerid = events.objectid
        LEFT JOIN
            triggers ON triggers.triggerid =events.objectid
        LEFT JOIN
            items ON items.itemid = functions.min_itemid
        LEFT JOIN
            hosts ON hosts.hostid = items.hostid
        LEFT JOIN
            hosts_groups ON hosts_groups.hostid = hosts.hostid
        LEFT JOIN
                interface ON interface.hostid = hosts.hostid
        LEFT JOIN
            hstgrp ON hstgrp.groupid = hosts_groups.groupid 
        WHERE 
            hstgrp.groupid = ? AND DATE(FROM_UNIXTIME(events.clock)) = ? AND events.severity > 1 AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [groupId, date_interval, limit]
    );
    return response[0];
}

export async function getRangeAlertsRepository(groupId: number, date_interval: string, limit: number) {
    const response = await db.query (
        `SELECT
            hosts.name AS Host,
            MAX(interface.ip) AS Interface,
            events.name AS Alerta,
            CASE 
                WHEN events.severity = 2 THEN 'Warning'
                WHEN events.severity = 3 THEN 'Average'
                WHEN events.severity = 4 THEN 'High'
                WHEN events.severity = 5 THEN 'Disaster'
                ELSE 'Outro' 
            END AS Severidade,
            COUNT(DISTINCT events.eventid) AS Total, -- Contando cada evento apenas uma vez
            hstgrp.name AS groupName,
            events.severity AS event_severity,
            GROUP_CONCAT(DISTINCT FROM_UNIXTIME(events.clock)) AS event_times,
            GROUP_CONCAT(DISTINCT events.eventid) AS event_ids,
            GROUP_CONCAT(DISTINCT items.name) AS items,            
            GROUP_CONCAT(DISTINCT CONCAT(items.description, ' ', triggers.comments)) AS items_descrip     
        FROM
            events 
        LEFT JOIN (
            SELECT MIN(itemid) AS min_itemid, triggerid
            FROM functions
            GROUP BY triggerid
        ) AS functions ON functions.triggerid = events.objectid
        LEFT JOIN
            triggers ON triggers.triggerid =events.objectid
        LEFT JOIN
            items ON items.itemid = functions.min_itemid
        LEFT JOIN
            hosts ON hosts.hostid = items.hostid
        LEFT JOIN
            hosts_groups ON hosts_groups.hostid = hosts.hostid
        LEFT JOIN
                interface ON interface.hostid = hosts.hostid
        LEFT JOIN
            hstgrp ON hstgrp.groupid = hosts_groups.groupid 
        WHERE 
            hstgrp.groupid = ? AND events.clock >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ${date_interval})) AND events.severity > 1 AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [groupId, limit]
    );
    return response[0];
}