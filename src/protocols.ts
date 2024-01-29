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
    clock: number;
    name: string;
    formatted_clock: string;
}

export type HostsOutpus = {
    hostid: number;
    host: string;
    name: string;
    name_upper: string;
}