import { LinkDailyTrendReport, TrendsOutput } from "../protocols";
import { getDowntimes, getMonthTrendByItemIdRepository } from "../repositories";
import { getTimestampsOfDay, getTimestampsOfMonth, last12MonthsList } from "./manageTime-service";
import moment from "moment";

export async function getMonthTrendByItemIdService(itemid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const responseDB: TrendsOutput[] = await getMonthTrendByItemIdRepository(itemid, firstTimestamp, lastTimestamp);
    const response = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));

    const trendsAverage = await getLinkDailyTrendByItemIdService(itemid, month);
    const fullResponse: any = {graph: response, average: trendsAverage};
    return fullResponse;
}

export async function getLinkDailyTrendByItemIdService(itemid: number, month: string) {
    const response: LinkDailyTrendReport[] = [];
    const parsedMonth = new Date(`${month}-01T00:00:00`);
    const days = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth()+1, 0).getDate();
    for (let i = 1; i <= days; i++){
        const day = `${month}-${i.toString().padStart(2, '0')}`;
        const { firstTimestamp, lastTimestamp } = getTimestampsOfDay(day);
        const responseDB: TrendsOutput[] = await getMonthTrendByItemIdRepository(itemid, firstTimestamp, lastTimestamp);
        const totalValueAvg = responseDB.reduce((accumulator, item) => accumulator + ((Number(item.value_max)+Number(item.value_min))/2), 0);
        const dailyMedia = ((totalValueAvg / responseDB.length)*100).toFixed(2);
        const objectResponse = {itemid: itemid, day: day, average: `${dailyMedia}`}
        response.push(objectResponse);
    }
    //const response: TrendsOutput[] = await getDowntimes(itemid, firstTimestamp, lastTimestamp);
    return response;
}

export async function getMonthlyAverageByItemIdService(itemid: number){
    const months = last12MonthsList();
    let i = 1;
    const response: LinkDailyTrendReport[] = [];
    while (i < 13) {
        const objectResponse = await calculateTrendAverage(months[i], itemid);
        response.push(objectResponse);
        if (objectResponse.average === "0"){
            break;
        }
        i++;
    }
    return response.reverse();
}

async function calculateTrendAverage(month: string, itemid: number){
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const responseDB: TrendsOutput[] = await getMonthTrendByItemIdRepository(itemid, firstTimestamp, lastTimestamp);
    if(responseDB.length === 0) {
        const objectResponse = {itemid: itemid, day: month, average: '0'}
    return objectResponse;
    }
    const totalValueAvg = responseDB.reduce((accumulator, item) => accumulator + ((Number(item.value_max)+Number(item.value_min))/2), 0);
    const dailyMedia = ((totalValueAvg / responseDB.length)*100).toFixed(2);
    const objectResponse = {itemid: itemid, day: month, average: `${dailyMedia}`}
    return objectResponse;
}