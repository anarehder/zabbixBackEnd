import { reportInput } from "../protocols";
import Joi from "joi";

export const getReportSchema = Joi.object<reportInput>({
    groupId: Joi.number().required(),
    start: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
    end: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required()
})