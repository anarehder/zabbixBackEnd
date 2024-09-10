import { alertsInput, alertsOutput } from "../protocols";
import { getAllHostsDayAlertsRepository, getAllHostsRangeAlertsRepository, getDayAlertsRepository, getRangeAlertsRepository } from "../repositories";

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