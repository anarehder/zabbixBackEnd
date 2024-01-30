import { HistoryOutput, LinksHostsOutput } from "@/protocols";
import { getLastValueHistoryRepository, getLinkHostsWithItems } from "@/repositories";
import moment from "moment";

export async function getLastValueHistoryService() {
    const linkHosts = await getLinkHostsWithItems();
    const hostidsList: number[] = linkHosts.map(linkHost => linkHost.hostid);

    const responseDB: HistoryOutput[] = await getLastValueHistoryRepository(hostidsList);
    const responseformatted = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));

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
    
    const resultadoFinal = responseFiltered.map(obj1 => {
        const obj2 = linkHosts.find(obj2 => obj2.itemid === Number(obj1.itemid));

        if (obj2) {
            return {
                ...obj1,
                ...obj2
            };
        }
    });

    return resultadoFinal;
}
