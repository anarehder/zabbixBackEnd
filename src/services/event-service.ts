import { DuracaoPorDia, Event2Output, EventDBOutput, EventsOutput, ObjectIdOutput, ObjectIdOutputFormatted, ResultadoEventos } from "@/protocols";
import { getEventsByHostIdRepository, getEventsRepository, getObjectIdsRepository } from "@/repositories"; 
import { converterSegundosParaDHMS, getTimestampsOfMonth } from "./manageTime-service";
import moment from "moment";

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

export async function getEventsByHostIdService(hostid: number, month: string) {
    const { firstTimestamp, lastTimestamp } = getTimestampsOfMonth(month);
    const eventDB: EventDBOutput[] = await getEventsByHostIdRepository(hostid, firstTimestamp, lastTimestamp);
    const eventFormatted = eventDB
    .filter(item => item.name.includes('ICMP ping'))
    .map(item => ({
        ...item,
        formatted_clock: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    const eventCalculated: Event2Output[] = calculateDuration(eventFormatted);
    const duracoes: ResultadoEventos[] = calcularDuracaoEventos(eventCalculated);
    return duracoes;
}

function calculateDuration(response: EventsOutput[]){
    const new_array = [];

    for (let i = 0; i < response.length; i += 2) {
        const pair_start = response[i];
        const start_timestamp = Number(pair_start.clock);
        if (i+1 === response.length) {
            const new_entry = {
                "duracao": '0',
                "inicioProblema": pair_start.formatted_clock,
                "fimProblema": "null",
                "name": pair_start.name
            };        
            new_array.push(new_entry);
        } else {
            const pair_end = response[i+1];
            const end_timestamp = Number(pair_end.clock);
            const duration_segundos = Math.floor((end_timestamp - start_timestamp));
            const duration = converterSegundosParaDHMS(duration_segundos);
            const new_entry = {
                "duracao": duration,
                "inicioProblema": pair_start.formatted_clock,
                "fimProblema": response[i+1].formatted_clock,
                "name": pair_start.name
            };
            new_array.push(new_entry);
        }
    }
    return new_array;
}

function calcularDuracaoEventos(eventos: Event2Output[]): ResultadoEventos[] {
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