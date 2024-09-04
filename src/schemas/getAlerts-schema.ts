import { alertsInput } from "../protocols";
import Joi from "joi";

export const getAlertsSchema = Joi.object<alertsInput>({
    groupid: Joi.number().required(),
    date_interval: Joi.string().required(),
    limit: Joi.number().required(),
    type: Joi.string().valid('day', 'range').required()
})