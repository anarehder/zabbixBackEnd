import { getLinksProblemsByGroupIpRepository, getLinksValuesByGroupIdRepository } from "../repositories/links-repository";

export async function getLinksLiveService(groupId: number) {
    const linksValues = await getLinksValuesByGroupIdRepository(groupId);
    const linksProblems = await getLinksProblemsByGroupIpRepository(groupId);
    const response = {live: linksValues, problems: linksProblems};
    return response;
}