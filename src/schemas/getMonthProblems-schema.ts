import { MonthProblemParams } from "../protocols";
import Joi from "joi";

export const getMonthProblemsSchema = Joi.object<MonthProblemParams>({
    hostid: Joi.number().required(),
    month: Joi.string().regex(/^\d{4}-\d{2}$/).required()
})