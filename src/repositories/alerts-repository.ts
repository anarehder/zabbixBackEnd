import { alertsOutput, last15DaysTotalAlerts, last3MonthsAlertsOutput } from "../protocols";
import { db } from "../config/database";
import { RowDataPacket } from "mysql2";

export async function getDayAlertsRepository(groupId: number, date_interval: string, limit: number, severity: number) {
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
            hstgrp.groupid = ? AND DATE(FROM_UNIXTIME(events.clock)) = ? AND events.severity >= ? AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [groupId, date_interval, severity, limit]
    );
    return response[0];
}

export async function getRangeAlertsRepository(groupId: number, date_interval: string, limit: number, severity: number) {
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
            hstgrp.groupid = ? AND events.clock >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ${date_interval})) AND events.severity >= ? AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [groupId, severity, limit]
    );
    return response[0];
}


export async function getLastMonthByNameAlertsRepository(name: string) {
    const response = await db.query (
        `SELECT
            GROUP_CONCAT(DISTINCT hosts.name) AS Host,
            events.name AS Alerta,
            CASE
                WHEN events.severity = 2 THEN 'Warning'
                WHEN events.severity = 3 THEN 'Average'
                WHEN events.severity = 4 THEN 'High'
                WHEN events.severity = 5 THEN 'Disaster'
                ELSE 'Outro'
            END AS Severidade,
            COUNT(DISTINCT events.eventid) AS Total,
            events.severity AS event_severity,
            GROUP_CONCAT(DISTINCT FROM_UNIXTIME(events.clock)) AS event_times,
            GROUP_CONCAT(DISTINCT events.eventid) AS event_ids,
            GROUP_CONCAT(DISTINCT items.name) AS items,
            GROUP_CONCAT(DISTINCT CONCAT(items.description, ' ', triggers.comments)) AS items_descrip
        FROM
            events
        LEFT JOIN (
            SELECT
                MIN(itemid) AS min_itemid,
                triggerid
            FROM
                functions
            GROUP BY
                triggerid
                ) AS functions ON
            functions.triggerid = events.objectid
        LEFT JOIN
                    triggers ON
            triggers.triggerid = events.objectid
        LEFT JOIN
                    items ON
            items.itemid = functions.min_itemid
        LEFT JOIN
                    hosts ON
            hosts.hostid = items.hostid
        WHERE
            events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'))
            AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))
            AND events.severity >= 4
            AND events.value = 1
            AND events.name like ?
        GROUP BY
            events.name,
            events.severity
            -- Removendo a agregação por events.name
        ORDER BY
            total DESC;`,
        [name]
    );
    return response[0];
}


export async function getLastMonthAlertsRepository(groupId: number) {
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
            hstgrp.groupid = ? AND events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01')) AND events.severity >= 3 AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC;`,
        [groupId]
    );
    return response[0];
}

export async function getAllHostsDayAlertsRepository(date_interval: string, limit: number, severity: number) {
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
            events.clock >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ${date_interval})) AND events.severity >= ? AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [severity, limit]
    );
    return response[0];
}

export async function getAllHostsRangeAlertsRepository(date_interval: string, limit: number, severity: number) {
    const [rows] = await db.query<RowDataPacket[]>(
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
            events.clock >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ${date_interval})) AND events.severity >= ? AND events.value = 1
        GROUP BY 
            hosts.name, events.name, events.severity -- Removendo a agregação por events.name
        ORDER BY
            total DESC
		LIMIT ?;`,
        [severity, limit]
    );

    const typedResults: alertsOutput[] = rows.map((row) => ({
        Host: row.Host,
        Interface: row.Interface,
        Alerta: row.Alerta,
        Severidade: row.Severidade,
        Total: row.Total,
        groupName: row.groupName,
        event_severity: row.event_severity,
        event_times: row.event_times,
        event_ids: row.event_ids,
        items: row.items,
        items_descrip: row.items_description
    }));
    return typedResults;
}

export async function lastMonthTop10AlertsRepository(whereCondition: string){
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT
            GROUP_CONCAT(DISTINCT events.objectid) AS objectid,
            GROUP_CONCAT(DISTINCT events.eventid) AS eventid,
            GROUP_CONCAT(DISTINCT events.name) AS name,
            GROUP_CONCAT(DISTINCT events.severity) AS severity,
            GROUP_CONCAT(DISTINCT events.clock) AS clock,
            GROUP_CONCAT(DISTINCT functions.itemid) AS itemid,
            GROUP_CONCAT(DISTINCT items.name) AS item,
            GROUP_CONCAT(DISTINCT hosts.host) AS host,
            GROUP_CONCAT(DISTINCT hosts.hostid) AS hostid,
            COUNT(DISTINCT events.eventid) AS Total
        FROM
            events
        LEFT JOIN (
            SELECT
                MAX(itemid) AS itemid,
                triggerid
            FROM
                functions
            GROUP BY
                triggerid
                ) AS functions ON
            functions.triggerid = events.objectid
        LEFT JOIN
                    items ON
            items.itemid = functions.itemid
        LEFT JOIN
                    hosts ON
            hosts.hostid = items.hostid
        LEFT JOIN
                    hosts_groups ON
            hosts_groups.hostid = hosts.hostid
        WHERE
            ${whereCondition}
        GROUP BY 
            items.name
        ORDER BY
            Total DESC
		LIMIT 10;
        ;`
    );
    const typedResults: alertsOutput[] = rows.map((row) => ({
        Host: row.host,
        Alerta: row.name,
        Severidade: row.severity,
        Total: row.Total,
        event_severity: row.severity,
        event_times: row.clock,
        event_ids: row.eventid,
        items: row.item
    }));
    return typedResults;
}

export async function last3MonthsTotalByAlertRepository(name: string){
    const response = await db.query(
        `SELECT
            events.name AS Alerta,    
            SUM(CASE 
                WHEN events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01')) 
                THEN 1 
                ELSE 0 
            END) AS month1,
            SUM(CASE 
                WHEN events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'))
                THEN 1 
                ELSE 0 
            END) AS month2,
            SUM(CASE 
                WHEN events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m-01'))
                THEN 1 
                ELSE 0 
            END) AS month3
        FROM 
            events
        WHERE 
            events.severity >= 5
            AND events.value = 1
            AND events.name like ?
        GROUP BY
            events.name 
        ORDER BY
            month1 DESC;`,
        [name]
    );
    
    return response[0];
}


export async function lastMonthTop10HostsAlertsRepository(whereCondition: string){
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT
            hosts.name AS Host,
            MAX(interface.ip) AS Interface,
            GROUP_CONCAT(DISTINCT events.name) AS Alerta,
            CASE 
                WHEN events.severity = 2 THEN 'Warning'
                WHEN events.severity = 3 THEN 'Average'
                WHEN events.severity = 4 THEN 'High'
                WHEN events.severity = 5 THEN 'Disaster'
                ELSE 'Outro' 
            END AS Severidade,
            COUNT(DISTINCT events.eventid) AS Total, -- Contando cada evento apenas uma vez
            GROUP_CONCAT(DISTINCT hstgrp.name) AS groupName,
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
            ${whereCondition}
        GROUP BY 
            hosts.name, events.severity
        ORDER BY
            Total DESC
        LIMIT 10
        ;`
    );
    const typedResults: alertsOutput[] = rows.map((row) => ({
        Host: row.Host,
        Interface: row.Interface,
        Alerta: row.Alerta,
        Severidade: row.Severidade,
        Total: row.Total,
        groupName: row.groupName,
        event_severity: row.event_severity,
        event_times: row.event_times,
        event_ids: row.event_ids,
        items: row.items,
        items_descrip: row.items_description
    }));
    return typedResults;
}

export async function last15DaysTotalAlertsRepository(whereCondition: string){
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT 
            DATE(FROM_UNIXTIME(events.clock)) AS Day,
            COUNT(CASE WHEN events.severity = 1 THEN 1 END) AS AlertOne,
            COUNT(CASE WHEN events.severity = 2 THEN 1 END) AS Warning,
            COUNT(CASE WHEN events.severity = 3 THEN 1 END) AS Average,
            COUNT(CASE WHEN events.severity = 4 THEN 1 END) AS High,
            COUNT(CASE WHEN events.severity = 5 THEN 1 END) AS Disaster,
            COUNT(*) AS Total
        FROM events
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
            events.value = 1
            ${whereCondition}
            AND DATE(FROM_UNIXTIME(events.clock)) >= DATE_SUB(CURDATE(), INTERVAL 15 DAY)
        GROUP BY 
            DATE(FROM_UNIXTIME(events.clock));`
    );
    const typedResults: last15DaysTotalAlerts[] = rows.map((row) => ({
        Day: row.Day,
        AlertOne: row.AlertOne,
        Warning: row.Warning,
        Average: row.Average,
        High: row.High,
        Disaster: row.Disaster,
        Total: row.Total        
    }));
    return typedResults;
}


export async function lastMonthTotalAlertsRepository(name: string){
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT
            DATE(FROM_UNIXTIME(events.clock)) AS Day,
            SUM(CASE WHEN events.severity = 1 THEN 1 ELSE 0 END) AS AlertOne,
            SUM(CASE WHEN events.severity = 2 THEN 1 ELSE 0 END) AS Warning,
            SUM(CASE WHEN events.severity = 3 THEN 1 ELSE 0 END) AS Average,
            SUM(CASE WHEN events.severity = 4 THEN 1 ELSE 0 END) AS High,
            SUM(CASE WHEN events.severity = 5 THEN 1 ELSE 0 END) AS Disaster
        FROM
            events
        WHERE
            events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'))
            AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))
            AND events.value = 1
            AND events.name like ?
        GROUP BY
            DATE(FROM_UNIXTIME(events.clock));`, [name]
    );
    const typedResults: last15DaysTotalAlerts[] = rows.map((row) => ({
        Day: row.Day,
        AlertOne: row.AlertOne,
        Warning: row.Warning,
        Average: row.Average, 
        High: row.High,
        Disaster: row.Disaster  
    }));
    return typedResults;
}

