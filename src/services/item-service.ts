import { getItemsRepository } from "../repositories";
import { ItemsOutput } from "../protocols";

export async function getItemsService(hostid: number) {
    const response: ItemsOutput[] | any = await getItemsRepository(hostid);
    return response;
}
