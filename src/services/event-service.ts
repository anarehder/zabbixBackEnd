import { DuracaoPorDia, Event2Output, EventsOutput, LinkDailyReport, ObjectIdOutput, ObjectIdOutputFormatted, ResultadoEventos } from "@/protocols";
import { getEventsByHostIdRepository, getEventsRepository, getLastProblemByHostidRepository, getObjectIdsRepository } from "@/repositories"; 
import { converterSegundosParaDHMS, getTimestampsOfMonth } from "./manageTime-service";
import moment from "moment";
import { getProblemsByHostidService } from "./problem-service";

export async function getEventService() {
    const responseDB: EventsOutput[] | any = await getEventsRepository();
    const response = calculateDuration(responseDB[0]);
    return response;
}

export async function getObjectIdsService(hostid: string){
    const response: ObjectIdOutput[] = await getObjectIdsRepository(hostid);
    const uniqueEvents: ObjectIdOutputFormatted[] = response
    .filter((event, index, self) => index === self.findIndex((e) => e.objectid === event.objectid))
    .map(({ eventid, ...rest }) => rest);

    return uniqueEvents;
}

export async function getLinkEventsByHostIdService(hostid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const eventDB: EventsOutput[] = await getEventsByHostIdRepository(hostid, firstTimestamp, lastTimestamp);
    const eventFormatted = eventDB
    .filter(item => item.name.includes('Unavailable by ICMP ping'))
    .map(item => ({
        ...item,
        formatted_clock: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    const problemDB = await getProblemsByHostidService(hostid, month);
    const problemSize = problemDB.problem.length;
    if (problemSize > 1) {
        const lastProblem = problemDB.problem.slice(-1)[0];
        const eventObject = {event: eventFormatted, problem: lastProblem};
        return eventObject;
    } else {
        const eventObject = {event: eventFormatted, problem: problemDB.problem};
        return eventObject;
    }
}

export async function getLinkDailyReportByHostIdService(hostid: number, month: string) {
    const events = await getLinkEventsByHostIdService(hostid, month);
    const eventFormatted = events.event;
    const eventLength = eventFormatted.length;
    let lastProblem: EventsOutput;
    if (eventFormatted.length === 0) {
        lastProblem = await getLastProblemByHostidRepository(hostid);
        if (lastProblem?.severity !== 0){
            const firstEvent = checkFirstEvent(lastProblem, month);
            eventFormatted.unshift(firstEvent);
            const lastEvent = checkLastEvent(eventFormatted[0], month);
            eventFormatted.push(lastEvent);
        }
    }
    if (eventLength !== 0 && eventFormatted[0]?.severity == 0) {
        const firstEvent = checkFirstEvent(eventFormatted[0], month);
        eventFormatted.unshift(firstEvent);
    }
    if (eventLength !== 0 && eventFormatted[eventLength-1]?.severity != 0) {
        const lastEvent = checkLastEvent(eventFormatted[eventLength-1], month);
        eventFormatted.push(lastEvent);
    }
    const eventCalculated: Event2Output[] = calculateDuration(eventFormatted);
    const problemsDuration: ResultadoEventos[] = dailyDuration(eventCalculated);
    const fullEvents = completeMonth(month, problemsDuration);
    const fullResponse = {eventFormatted:eventFormatted, eventCalculated: eventCalculated, fullEvents:fullEvents};
    return fullResponse;
}

function completeMonth(month: string, problemsDuration: ResultadoEventos[]) {
    const parsedMonth = new Date(`${month}-01T00:00:00`);
    const lastDay = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0).getDate();

    const fullEvents: ResultadoEventos[] = [];
    for (let dia = 1; dia <= lastDay; dia++) {
        const formattedDay = dia.toString().padStart(2, "0");
        const checkDate = `${month}-${formattedDay}`;
        const existingEvent = problemsDuration.find(event => event.dia === checkDate);
        if (existingEvent) {
            fullEvents.push(existingEvent);
        } else {
            const currentDate = new Date(`${month}-${formattedDay}`);
            const today = new Date();
            if (currentDate >= today) {
                fullEvents.push({ dia: checkDate, duracao: "-", porcentagem: "-" });
            } else {
                fullEvents.push({ dia: checkDate, duracao: "0", porcentagem: "100.00" });
            }
        }
    }

    return fullEvents;
}

function calculateDuration(response: EventsOutput[]){
    const new_array = [];
    for (let i = 0; i < response.length; i += 2) {
        const pair_start = response[i];
        const start_timestamp = Number(pair_start.clock);
            const pair_end = response[i+1];
            const end_timestamp = Number(pair_end.clock);
            const duration_segundos = Math.floor((end_timestamp - start_timestamp));
            const duration = converterSegundosParaDHMS(duration_segundos);
            const new_entry = {
                "duracao": duration,
                "inicioProblema": pair_start.formatted_clock,
                "startStamp": start_timestamp,
                "fimProblema": response[i+1].formatted_clock,
                "endStamp": end_timestamp,
                "name": pair_start.name
            };
            new_array.push(new_entry);
    }
    return new_array;
}

function dailyDuration(eventos: Event2Output[]): ResultadoEventos[] {
    const duracaoPorDia: DuracaoPorDia = {};

    eventos.forEach((evento) => {
        const inicio = moment(evento.inicioProblema);
        if (evento.duracao === '0'){
            const month = Number(evento.inicioProblema.slice(5,7));
            const year = Number(evento.inicioProblema.slice(0,4));
            const ultimoDia = new Date(year,month,0).getDate();
            if (ultimoDia.toString() !== evento.inicioProblema.slice(8,10)){
                duracaoPorDia[inicio.format('YYYY-MM-DD')] = evento.inicioProblema;
            }
        } else {
            const fim = moment(evento.fimProblema);

            const diaInicio = inicio.format('YYYY-MM-DD');
            const diaFim = fim.format('YYYY-MM-DD');
            const duracaoDiasIntermediarios = 86400;
            // Verificar se o evento se estende para mais de um dia
            if (diaInicio === diaFim) {
                // Evento ocorre no mesmo dia
                const duracao = fim.diff(inicio, 'seconds');
                const valorIncio = (Number(duracaoPorDia[diaInicio]) || 0) + duracao;
                duracaoPorDia[diaInicio] = `${valorIncio}`;
            } else {
                // Evento se estende para mais de um dia
                const duracaoPrimeiroDia = (1439 - inicio.hours() * 60 - inicio.minutes()) * 60;
                const valorIncio = (Number(duracaoPorDia[diaInicio]) || 0) + duracaoPrimeiroDia;
                duracaoPorDia[diaInicio] = `${valorIncio}`;

                let diaAtual = inicio.clone().add(1, 'days');

                while (!diaAtual.isSame(diaFim, 'day')) {
                    const diaIntermediario = diaAtual.format('YYYY-MM-DD');
                    const valorIntermediario = (Number(duracaoPorDia[diaInicio]) || 0) + duracaoDiasIntermediarios;
                    duracaoPorDia[diaIntermediario] = `${valorIntermediario}`;
                    diaAtual.add(1, 'days');
                }

                const duracaoUltimoDia = (fim.hours() * 60 + fim.minutes()) * 60;
                const valorFim = (Number(duracaoPorDia[diaInicio]) || 0) + duracaoUltimoDia
                duracaoPorDia[diaFim] = `${valorFim}`;;
            }
        }
    });
    if (eventos[0].endStamp <= Math.floor(new Date().getTime()/1000 + 300) ){
        const resultado: ResultadoEventos[] = Object.entries(duracaoPorDia).map(([dia, duracao]) => ({
            dia,
            duracao,
            porcentagem: "0",
        }));
        return resultado;
    } else {
        const resultado: ResultadoEventos[] = Object.entries(duracaoPorDia).map(([dia, duracao]) => ({
            dia,
            duracao,
            porcentagem: isNaN(Number(duracao)) ?  "calcular !" : (100-(Number(duracao)/ 86400) * 100).toFixed(4),
        }));
        return resultado;
    }
}

function checkFirstEvent(event: EventsOutput, month: string) {
    // pego o mes anterior a este, e pego o ultimo valor do events?
    const dayString = `${month}-01T00:00:00.000`
    const day = (new Date(dayString).getTime() / 1000).toFixed(0);
    const newObject =
    {
        eventid: event.eventid,
        objectid: event.objectid,
        name: event.name,
        clock: `${day}`,
        severity: 55,
        formatted_clock: `${month}-01 00:00:00`,
    };
    return newObject;
}

function checkLastEvent(event: EventsOutput, month:string) {
    const parsedMonth = new Date(`${month}-01`);
    const days = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth()+1, 0).getDate();
    const dayString = `${month}-${days}T23:59:59.999`; //horario de brasilia
    const today = new Date();
    const day = (new Date(dayString).getTime() / 1000).toFixed(0);
    if (today >= new Date(dayString)){
        const newObject =
        {
            eventid: event.eventid,
            objectid: event.objectid,
            name: event.name,
            clock: `${day}`,
            severity: 50,
            formatted_clock: `${month}-${days} 23:59:59`,
        };
        return newObject;
    } else {
        const todayTimestamp = (new Date().getTime()/1000).toFixed(0);
        const newObject =
        {
            eventid: event.eventid,
            objectid: event.objectid,
            name: event.name,
            clock: `${todayTimestamp}`,
            severity: 50,
            formatted_clock: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
        };
        return newObject;
    }
    
}