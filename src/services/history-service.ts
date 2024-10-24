import { EventsOutput, HistoryOutput, LinksLatestValuesByLocation } from "../protocols";
import { getLastValueHistoryRepository, getLinkHostsWithItems, getHostsLinksFirewallRepository, getProblemsByHostidListRepository, getValuesUINTRespository, getHostsServersRepository, getLinksLatestValuesByGroupIdRepository, getLinksProblemsByGroupIpRepository, getLinksLocationsRepository, getLinksLastValuesByGroupIdLocationRepository2 } from "../repositories";
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

export async function getLinksValuesProblemsService(groupId: number) {
    const locations = await getLinksLocationsRepository(groupId);
    const latestLinkValues: LinksLatestValuesByLocation[] = [];
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i].location;
        const locationLinkValues = await getLinksLastValuesByGroupIdLocationRepository2(groupId, location);
        latestLinkValues.push({ location: location, info: locationLinkValues });
    }
    const linksProblems = await getLinksProblemsByGroupIpRepository(groupId);
    const response = { values: latestLinkValues, problems: linksProblems };
    return (response);
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
    const server = "LINUX";
    const hosts = await getHostsServersRepository(server);
    const response = [];
    for (let i= 0; i< hosts.length; i++) {
        const values = await getValuesUINTRespository(hosts[i].itemid);
        const item = {...hosts[i], graph: values};
            response.push(item);
    }
    return response;
}

export async function getServersWindowsService(page: number) {
    const itemsPerPage = 40;
    const server = "WINDOWS";
    const hosts = await getHostsServersRepository(server);
    const totalPages = Math.ceil(hosts.length / itemsPerPage);
    if (page > totalPages){
        throw new Error('Página solicitada está fora do intervalo válido.');
    }
    
    const firstItem = (page-1)*itemsPerPage;
    const lastItem = firstItem+itemsPerPage;
    const paginationHosts = hosts.slice(firstItem, lastItem);
    const responseValues = [];
    for (let i= 0; i< paginationHosts.length; i++) {
        const values = await getValuesUINTRespository(hosts[i].itemid);
        const item = {...paginationHosts[i], graph: values};
        responseValues.push(item);
    }
    const response = { pageData: {totalPages: totalPages, actualPage: page}, values: responseValues};
    return response;
}