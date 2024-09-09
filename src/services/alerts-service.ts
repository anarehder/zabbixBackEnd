import { alertsInput, alertsOutput } from "../protocols";
import { getDayAlertsRepository, getRangeAlertsRepository } from "../repositories";

export async function getAlretsService(body: alertsInput){
    //verificar o groupid
    if (body.type === 'day'){
        const response = await getDayAlertsRepository(body.groupId, body.date_interval, body.limit);
        return response;
    }
    if (body.type === 'range'){
        const response = await getRangeAlertsRepository(body.groupId, body.date_interval, body.limit);
        return response;
    }    
}