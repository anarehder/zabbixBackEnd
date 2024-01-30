import moment from "moment";

export function getTimestampsOfMonth(month: string) {
    const parsedMonth = new Date(`${month}-01`);
    const days = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 0).getDate();

    const dataMoment = moment(`${month}-01`);
    const firstTimestamp = dataMoment.valueOf()/1000;
    const lastTimestamp = firstTimestamp + (days*24*60*60);

    return { firstTimestamp, lastTimestamp };
}

export function getTimestampsOfDay(day: string) {
    const dataMoment = moment(day);
    const firstTimestamp = dataMoment.valueOf()/1000;
    const lastTimestamp = firstTimestamp + (24*60*60);

    return { firstTimestamp, lastTimestamp };
}