import { getLinksLocationsRepository } from "../repositories";
import { getLinksLastValuesByGroupIdLocationRepository, getLinksProblemsByGroupIpRepository, getLinksValuesByGroupIdRepository } from "../repositories/links-repository";
import { LinksLatestValuesByLocation } from "../protocols";

export async function getLinksLiveService(groupId: number) {
    const linksValues = await getLinksValuesByGroupIdRepository(groupId);
    const linksProblems = await getLinksProblemsByGroupIpRepository(groupId);
    const response = {live: linksValues, problems: linksProblems};
    return response;
}

export async function getLinksLiveByLocationService(groupId: number) {
    const locations = await getLinksLocationsRepository(groupId);
    const latestLinkValues: LinksLatestValuesByLocation[] = [];
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i].location;
        const locationLinkValues = await getLinksLastValuesByGroupIdLocationRepository(groupId, location);
        latestLinkValues.push({ location: location, info: locationLinkValues });
    }
    const linksProblems = await getLinksProblemsByGroupIpRepository(groupId);
    const response = { values: latestLinkValues, problems: linksProblems };
    return (response);
}