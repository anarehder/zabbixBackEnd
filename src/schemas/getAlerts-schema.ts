import { alertsInput } from "../protocols";
import Joi from "joi";

export const getAlertsSchema = Joi.object<alertsInput>({
    groupId: Joi.number().required(),
    date_interval: Joi.string().required(),
    limit: Joi.number().required(),
    type: Joi.string().valid('day', 'range').required(),
    severity: Joi.number().valid(2,3,4,5).required(),
})