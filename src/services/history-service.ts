import { EventsOutput, HistoryOutput, LinksHostsOutput } from "@/protocols";
import { getLastValueHistoryRepository, getLinkHostsWithItems, getHostsLinksFirewallRepository, getProblemsByHostidListRepository, getValuesUINTRespository, getHostsServersLinuxRepository } from "@/repositories";
import moment from "moment";

export async function getLastValueHistoryService() {
    const linkHosts = await getLinkHostsWithItems();
    
    const hostidsList: number[] = linkHosts.map(linkHost => linkHost.hostid);

    const responseDB: HistoryOutput[] = await getLastValueHistoryRepository(hostidsList);
    const responseformatted = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));
    
    //ver se tem duplicado o host
    const responseFiltered = responseformatted.reduce((accumulator, currentItem) => {
        const existingItemIndex = accumulator.findIndex(item => item.itemid === currentItem.itemid);
        if (existingItemIndex !== -1) {
            if (currentItem.clock > accumulator[existingItemIndex].clock) {
                accumulator[existingItemIndex] = currentItem;
            }
        } else {
            if (currentItem.value !== null) {
                accumulator.push(currentItem);
            }
        }
        return accumulator;
    }, []);
    //juntar os dados do linkHosts com o responseDB
    const resultadoFinal = responseFiltered.map(obj1 => {
        const obj2 = linkHosts.find(obj2 => obj2.itemid === Number(obj1.itemid));
        if (obj2) {
            return {
                ...obj1,
                ...obj2
            };
        }
    });
    const linksHosts = resultadoFinal.map(item => item.hostid);
    const problems: EventsOutput[] = await getProblemsByHostidListRepository(linksHosts);
    const filteredProblems = problems.filter(item => item.name.includes("Unavailable by ICMP ping"));

    const joinedResult = {live: resultadoFinal, problems: filteredProblems}
    return joinedResult;
}

export async function getLinksFirewallService() {
    const hosts = await getHostsLinksFirewallRepository();
    const responseSent = [];
    const responseReceived = [];
    for (let i= 0; i< hosts.length; i++) {
        const values = await getValuesUINTRespository(hosts[i].itemid);
        const item = {...hosts[i], graph: values};
        if (hosts[i].name.slice(-4) === "sent"){
            responseSent.push(item);
        }
        if (hosts[i].name.slice(-4) === "ived"){
            responseReceived.push(item);
        }
    }
    const response = { sent: responseSent, received: responseReceived};
    return response;
}

export async function getServersLinuxService() {
    const hosts = await getHostsServersLinuxRepository();
    const response = [];
    for (let i= 0; i< hosts.length; i++) {
        const values = await getValuesUINTRespository(hosts[i].itemid);
        const item = {...hosts[i], graph: values};
            response.push(item);
    }
    return response;
}