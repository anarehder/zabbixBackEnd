import { getItemsParams } from "@/protocols";
import Joi from "joi";

export const getItemsSchema = Joi.object<getItemsParams>({
    hostid: Joi.number().required(),
})