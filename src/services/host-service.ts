import { HostsOutpus } from "../protocols";
import { getHostGroupsLinksRepository, getHostGroupsRepository, getHostGroupsSubdivisionRepository, getHostsRepository } from "../repositories";

export async function getHostsService() {
    const response: HostsOutpus[] | any = await getHostsRepository();
    return response;
}

export async function getHostGroupsService() {
    const response = await getHostGroupsRepository();
    return response;
}

export async function getHostGroupsSubdivisionService(groupName: string) {
    const response = await getHostGroupsSubdivisionRepository(groupName);
    return response;
}

export async function getHostGroupsLinksService(groupName: string) {
    const response = await getHostGroupsLinksRepository(groupName);
    return response;
}



