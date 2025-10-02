import { alertsInput, alertsOutput } from "../protocols";
import { getAllHostsDayAlertsRepository, getAllHostsRangeAlertsRepository, getDayAlertsRepository, getLastMonthAlertsRepository, getLastMonthByNameAlertsRepository, getRangeAlertsRepository, last15DaysTotalAlertsRepository, last3MonthsTotalByAlertRepository, lastMonthTop10AlertsRepository, lastMonthTop10HostsAlertsRepository, lastMonthTotalAlertsRepository } from "../repositories";

export async function getAlretsService(body: alertsInput){
    //verificar o groupid
    if (body.type === 'day'){
        const response = await getDayAlertsRepository(body.groupId, body.date_interval, body.limit, body.severity);
        return response;
    }
    if (body.type === 'range'){
        const response = await getRangeAlertsRepository(body.groupId, body.date_interval, body.limit, body.severity);
        return response;
    }    
}

export async function getAllHostsAlretsService(body: alertsInput){
    if (body.type === 'day'){
        const response = await getAllHostsDayAlertsRepository(body.date_interval, body.limit, body.severity);
        return response;
    }
    if (body.type === 'range'){
        const response = await getAllHostsRangeAlertsRepository(body.date_interval, body.limit, body.severity);
        return response;
    }
}


export async function getAlertsDashboardService(groupId: number, time: string){
    //verificar o groupid
    let formattedTime = "";
    if (time === 'day') {
        formattedTime = "AND TIME(FROM_UNIXTIME(events.clock)) BETWEEN '08:00' AND '18:00'";
    }
    if (time === 'night'){
        formattedTime = "AND (TIME(FROM_UNIXTIME(events.clock)) < '08:00:00' OR TIME(FROM_UNIXTIME(events.clock)) > '18:00:00')"
    }
    const values = await top10AlertsValuesDashboard(groupId, formattedTime);
    const eventsNameArray = values.map(obj => obj.Alerta);
    const months = await last3MonthsTotalByAlert(eventsNameArray, formattedTime);
    const top_hosts = await top10HostsAlerts(groupId, formattedTime);
    const total_alerts = await last15DaysTotalAlertsService(groupId);
    const response = {values, months, top_hosts, total_alerts};
    return response;    
}

export async function getLastMonthAlertsService(groupId: number){
    const response = await getLastMonthAlertsRepository(groupId);
    return response;    
}

export async function getAletsJSPecasService() {
    const name = '%JS_Pecas%';
    const wcDisasterName = `events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))AND events.severity >= 5 AND events.value = 1 AND events.name like '%JS_Pecas%'`;
    const values = await lastMonthTop10AlertsRepository(wcDisasterName);
    const top_hosts = await lastMonthTop10HostsAlertsRepository(wcDisasterName);
    console.log(name);
    const months = await last3MonthsTotalByAlertRepository(name);
    console.log("months");
    const total_alerts = await lastMonthTotalAlertsRepository(name);
    console.log("total_alerts");
    const list = await getLastMonthByNameAlertsRepository(name);
    console.log("list");
    
    const response = {values, months, top_hosts, total_alerts, list};
    return response;  
}

export async function getAlertsPMZService() {
    const name = '%PEMAZA%';
    const wcDisasterName = `events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))AND events.severity >= 5 AND events.value = 1 AND events.name like '%PEMAZA%'`;
    const values = await lastMonthTop10AlertsRepository(wcDisasterName);
    const top_hosts = await lastMonthTop10HostsAlertsRepository(wcDisasterName);
    console.log(name);
    const months = await last3MonthsTotalByAlertRepository(name);
    console.log("months");
    const total_alerts = await lastMonthTotalAlertsRepository(name);
    console.log("total_alerts");
    const list = await getLastMonthByNameAlertsRepository(name);
    console.log("list");
    
    const response = {values, months, top_hosts, total_alerts, list};
    return response;  
}

export async function getLastMonthAlertsDashService(groupId: string){
    const groupIdNames: Record<string, string> = {
        715: '%JS_Pecas%',
        207: '%PEMAZA%',
    };
    const whereConditionDisaster = `events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))AND events.severity >= 5 AND events.value = 1 AND hstgrp.groupid = ${groupId}`;
    const wcDisasterName = `events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))AND events.severity >= 5 AND events.value = 1 AND events.name like '%${groupIdNames[groupId]}%'`
    const whereCondition = `events.clock >= UNIX_TIMESTAMP(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AND events.clock < UNIX_TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'))AND events.severity >= 3 AND events.value = 1 AND hstgrp.groupid = ${groupId}`;
    const formattedTime = "";

    const values = await lastMonthTop10AlertsRepository(groupId === '715' ? wcDisasterName : whereConditionDisaster);
    const eventsNameArray = values.map(obj => obj.Alerta);
    
    const top_hosts = await lastMonthTop10HostsAlertsRepository(whereConditionDisaster);

    const months = await last3MonthsTotalByAlert(eventsNameArray, formattedTime);

    const total_alerts = await lastMonthTotalAlertsRepository(whereCondition);

    const response = {values, months, top_hosts, total_alerts};
    return response;    
}




export async function top10AlertsValuesDashboard(groupId: number, formattedTime: string){
    if (groupId ===  0){
        const whereCondition = `events.clock > UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND events.severity >= 5 AND events.value = 1  ${formattedTime}`;
        const response = await lastMonthTop10AlertsRepository(whereCondition);
        return (response);
    } else {
        const whereCondition = `hstgrp.groupid = ${groupId} AND events.clock > UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND events.severity >= 5 AND events.value = 1 ${formattedTime}`;
        const response = await lastMonthTop10AlertsRepository(whereCondition);
        return (response);
    }
}

export async function last3MonthsTotalByAlert(eventsNameArray: string[], formattedTime: string) {
    const arrayResponse = [];
    for (let i=0; i<eventsNameArray.length; i++){
        const response = await last3MonthsTotalByAlertRepository(eventsNameArray[i]);
        arrayResponse.push(response);
    }
    return arrayResponse;
}

export async function top10HostsAlerts(groupId: number, formattedTime: string){
    if (groupId ===  0){
        const whereCondition = `events.clock > UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND events.severity >= 5 AND events.value = 1  ${formattedTime}`;
        const response = await lastMonthTop10HostsAlertsRepository(whereCondition);
        return (response);
    } else {
        const whereCondition = `hstgrp.groupid = ${groupId} AND events.clock > UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND events.severity >= 5 AND events.value = 1 ${formattedTime}`;
        const response = await lastMonthTop10HostsAlertsRepository(whereCondition);
        return (response);
    }
}

export async function last15DaysTotalAlertsService(groupId: number){
    if (groupId ===  0){
        const whereCondition = "";
        const response = await last15DaysTotalAlertsRepository(whereCondition);
        return (response);
    } else {
        const whereCondition = `AND hstgrp.groupid = ${groupId}`;
        const response = await last15DaysTotalAlertsRepository(whereCondition);
        return (response);
    }
}