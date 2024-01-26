import { EventsOutput } from "@/protocols";
import { getEventsRepository } from "@/repositories";

export async function getEventService() {
    const responseDB: EventsOutput[] | any = await getEventsRepository();
    const response = calculateDuration(responseDB[0]);
    console.log(response.length);
    return response;
}

function calculateDuration(response: EventsOutput[]){
    const new_array = [];

    for (let i = 0; i < response.length; i += 2) {
        const pair_end = response[i];
        const pair_start = response[i + 1] || null;
    
        const start_timestamp = pair_start.clock;
        const end_timestamp = pair_end ? pair_end.clock : Math.floor(Date.now() / 1000);
    
        const duration_segundos = Math.floor((end_timestamp - start_timestamp));
        const duration = converterSegundosParaDHMS(duration_segundos);
        const new_entry = {
            "duracao": duration,
            "inicioProblema": pair_start.formatted_clock,
            "fimProblema": pair_end ? pair_end.formatted_clock : null,
            "name": pair_start.name
        };
    
        new_array.push(new_entry);
    }
    return new_array;
}

function converterSegundosParaDHMS(segundos: number) {
    const dias = Math.floor(segundos / 86400); // 1 dia = 24 horas * 60 minutos * 60 segundos
    segundos %= 86400;

    const horas = Math.floor(segundos / 3600); // 1 hora = 60 minutos * 60 segundos
    segundos %= 3600;

    const minutos = Math.floor(segundos / 60); // 1 minuto = 60 segundos
    segundos %= 60;

    const duracaoFormatada = `${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
    
    return duracaoFormatada;
}