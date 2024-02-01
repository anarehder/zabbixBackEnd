import { EventsOutput, HistoryOutput, LinksHostsOutput } from "@/protocols";
import { getLastValueHistoryRepository, getLinkHostsWithItems, getProblemsByHostidListRepository } from "@/repositories";
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
