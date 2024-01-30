import { HistoryOutput, LinksHostsOutput } from "@/protocols";
import { getLastValueHistoryRepository, getLinkHostsWithItems } from "@/repositories";
import moment from "moment";

export async function getLastValueHistoryService() {
    

    const linkHosts = await getLinkHostsWithItems();
    const hostidsList: number[] = linkHosts.map(linkHost => linkHost.hostid);
    console.log(hostidsList.length);

    const responseDB: HistoryOutput[] = await getLastValueHistoryRepository(hostidsList);
    const responseformatted = responseDB.map(item => ({
        ...item,
        clock_formatado: moment.unix(Number(item.clock)).format('YYYY-MM-DD HH:mm:ss')
    }));

    console.log(responseDB.length);
    const resultadoFinal = linkHosts.map(obj1 => {
        const obj2 = responseformatted.find(obj2 => Number(obj2.itemid) === obj1.itemid);

        if (obj2) {
            // Se encontrou um correspondente, combina os objetos
            return {
                ...obj1,
                ...obj2
            };
        } else {
            // Se não encontrou, retorna apenas o objeto do primeiro array
            return obj1;
        }
    });

    return resultadoFinal;
}
