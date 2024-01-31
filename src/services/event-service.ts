import { DuracaoPorDia, Event2Output, EventsOutput, LinkDailyReport, ObjectIdOutput, ObjectIdOutputFormatted, ResultadoEventos } from "@/protocols";
import { getEventsByHostIdRepository, getEventsRepository, getObjectIdsRepository } from "@/repositories"; 
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
    if (eventLength !== 0 && eventFormatted[0]?.severity == 0) {
        const firstEvent = checkFirstEvent(eventFormatted[0]);
        eventFormatted.unshift(firstEvent);
    }
    if (eventLength !== 0 && eventFormatted[eventLength-1]?.severity != 0) {
        const lastEvent = checkLastEvent(eventFormatted[eventLength-1]);
        eventFormatted.push(lastEvent);
    }
    const eventCalculated: Event2Output[] = calculateDuration(eventFormatted);
    const duracoes: ResultadoEventos[] = dailyDuration(eventCalculated);
    return eventCalculated;
}

function calculateDuration(response: EventsOutput[]){
    const new_array = [];

    for (let i = 0; i < response.length; i += 2) {
        const pair_start = response[i];
        const start_timestamp = Number(pair_start.clock);
        // if (i+1 === response.length) {
        //     const new_entry = {
        //         "duracao": '0',
        //         "inicioProblema": pair_start.formatted_clock,
        //         "inicioStamp": start_timestamp,
        //         "fimProblema": "null",
        //         "name": pair_start.name
        //     };        
        //     new_array.push(new_entry);
        // } else {
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
        //}
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

    // Transformar o objeto em um array de objetos
    const resultado: ResultadoEventos[] = Object.entries(duracaoPorDia).map(([dia, duracao]) => ({
        dia,
        duracao,
        porcentagem: isNaN(Number(duracao))?  "calcular !" : `${(100-(Number(duracao)/ 86400) * 100).toFixed(4)}%`,
    }));

    return resultado;
}

function checkFirstEvent(event: EventsOutput) {
    const dayString = `${event.formatted_clock.slice(0, 7)}-01T00:00:00.000Z`
    const day = (new Date(dayString).getTime() / 1000).toFixed(0);
    const newObject =
    {
        eventid: event.eventid,
        objectid: event.objectid,
        name: event.name,
        clock: `${day}`,
        severity: 1,
        formatted_clock: moment(day).format('YYYY-MM-DD HH:mm:ss'),
    };
    return newObject;
}

function checkLastEvent(event: EventsOutput) {
    const parsedMonth = new Date(`${event.formatted_clock.slice(0, 7)}-01`);
    const days = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth()+1, 0).getDate();
    const dayString = `${event.formatted_clock.slice(0, 7)}-${days}T23:59:59.999Z`;
    const today = new Date();
    const day = (new Date(dayString).getTime() / 1000).toFixed(0);
    // se hoje for maior que o ultimo dia do mês uso o ultimo dia do mês como last day
    if (today >= new Date(dayString)){
        const newObject =
        {
            eventid: event.eventid,
            objectid: event.objectid,
            name: event.name,
            clock: `${day}`,
            severity: 0,
            formatted_clock: moment(day).format('YYYY-MM-DD HH:mm:ss'),
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
            severity: 0,
            formatted_clock: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
        };
        return newObject;
    }
    
}