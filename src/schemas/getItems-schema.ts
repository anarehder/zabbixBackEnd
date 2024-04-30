import { hostIdParams } from "../protocols";
import Joi from "joi";

export const getItemsSchema = Joi.object<hostIdParams>({
    hostid: Joi.number().required(),
})