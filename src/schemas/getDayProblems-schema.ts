import { DayProblemParams } from "../protocols";
import Joi from "joi";

export const getDayProblemsSchema = Joi.object<DayProblemParams>({
    hostid: Joi.number().required(),
    day: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required()
})