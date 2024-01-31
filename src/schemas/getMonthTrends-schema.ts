import { monthTrendParams } from "@/protocols";
import Joi from "joi";

export const getMonthTrendsSchema = Joi.object<monthTrendParams>({
    itemid: Joi.number().required(),
    month: Joi.string().regex(/^\d{4}-\d{2}$/)
})