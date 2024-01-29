import { HostsOutpus } from "../protocols";
import { getHostsRepository } from "../repositories";

export async function getHostsService() {
    const response: HostsOutpus[] | any = await getHostsRepository();
    return response;
}
