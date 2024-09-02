import { HostGroupsOutputs, HostsOutpus } from "../protocols";
import { getHostGroupsRepository, getHostsRepository } from "../repositories";

export async function getHostsService() {
    const response: HostsOutpus[] | any = await getHostsRepository();
    return response;
}

export async function getHostGroupsService() {
    const response: HostGroupsOutputs[] | any = await getHostGroupsRepository();
    return response;
}

