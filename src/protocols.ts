export type ApplicationError = {
    name: string;
    message: string;
};

export type ProblemsOutput = {
    eventid: number;
    source: number; 
    object: number;
    objectid: number;
    clock: number;
    ns: number;
    r_eventid: number | null;
    r_clock: number;
    r_ns: number;
    correlationid: number | null;
    userid: number | null;
    name: string;
    acknowledged: number;
    severity: number;
};

export type EventsOutput = {
    eventid: number;
    clock: string;
    name: string;
    objectid: number;
    severity: number | string;
    formatted_clock?: string;
}

export type HostsOutpus = {
    hostid: number;
    host: string;
    name: string;
    name_upper: string;
}

export type ItemsOutput = {
    itemid: number;
    hostid: number;
    name: string;
    key_: string;
    delay: string;
    history: string;
    trends: string;
    units: string;
}

export type hostIdParams = {
    hostid: number;
}

export type ObjectIdOutput = {
    eventid: number;
    name: string;
    objectid: string;
}

export type ObjectIdOutputFormatted = {
    name: string;
    objectid: string;
}

export type HistoryOutput = {
    itemid: string;
    clock: string;
    value: string;
    ns: string;
}

export type LinksHostsOutput = {
    hostid: number;
    host_name: string;
    itemid: number;
    item_name: string;
    groupid: number;
}

export type TrendsOutput = {
    itemid: number;
    clock: number;
    num: number;
    value_min: number;
    value_avg: number;
    value_max: number;
}

export type monthTrendParams = {
    itemid: number;
    month: string;
}

export type DayProblemParams = {
    hostid: number;
    day: string;
}

export type MonthProblemParams = {
    hostid: number;
    month: string;
}

export type Event2Output = {
    duracao: string;
    inicioProblema: string;
    fimProblema: string;
    name: string;
    startStamp: number;
    endStamp: number;
}

export type DuracaoPorDia = {
    [dia: string]: string;
}

export type ResultadoEventos = {
    day: string;
    duration: string;
    average: string;
}

export type LinkDailyReport = {
    objectid: number;
    name: string;
    day: string;
    startedTime: number;
    endedTime: number;
    duration: number;
    percentage: string;
}

export type LinkDailyTrendReport = {
    itemid: number;
    day: string;
    average: string;
}

export type fullDailyReport = {
    graph: TrendsOutput[];
    average: LinkDailyTrendReport[];
}

export type reportInput = {
    groupid: number;
    start: string;
    end: string;
}