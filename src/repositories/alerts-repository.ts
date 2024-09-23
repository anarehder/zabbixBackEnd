import { alertsOutput, last15DaysTotalAlerts, last3MonthsAlertsOutput } from "@/protocols";
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
            hosts.name, events.name, events.severity
        ORDER BY
            total DESC
		LIMIT 10;
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

export async function last3MonthsTotalByAlertRepository(eventName: string, formattedTime: string){
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT
            events.name AS Alerta,    

            SUM(CASE 
                WHEN DATE(FROM_UNIXTIME(events.clock)) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE() 
                THEN 1 
                ELSE 0 
            END) AS month1,

            SUM(CASE 
                WHEN DATE(FROM_UNIXTIME(events.clock)) BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
                THEN 1 
                ELSE 0 
            END) AS month2,

            SUM(CASE 
                WHEN DATE(FROM_UNIXTIME(events.clock)) BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND DATE_SUB(CURDATE(), INTERVAL 2 MONTH) 
                THEN 1 
                ELSE 0 
            END) AS month3
        FROM 
            events
        WHERE 
            events.name = ?
            AND events.severity >= 5 
            AND events.value = 1
            ${formattedTime}
        ;`, [eventName]
    );
    const typedResults: last3MonthsAlertsOutput[] = rows.map((row) => ({
        Alerta: row.Alerta,
        month1: row.month1,
        month2: row.month2,
        month3: row.month3
    }));
    return typedResults[0];
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
