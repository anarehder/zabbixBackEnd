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

export function converterSegundosParaDHMS(segundos: number) {
    const dias = Math.floor(segundos / 86400); // 1 dia = 24 horas * 60 minutos * 60 segundos
    segundos %= 86400;

    const horas = Math.floor(segundos / 3600); // 1 hora = 60 minutos * 60 segundos
    segundos %= 3600;

    const minutos = Math.floor(segundos / 60); // 1 minuto = 60 segundos
    segundos %= 60;

    const duracaoFormatada = `${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
    
    return duracaoFormatada;
}

export function last12MonthsList(){
    const dataAtual = moment();
    const resultados: string[] = [];
    for (let i = 0; i < 12; i++) {
        resultados.push(dataAtual.format('YYYY-MM'));
        dataAtual.subtract(1, 'months');
    }
    return resultados;
}