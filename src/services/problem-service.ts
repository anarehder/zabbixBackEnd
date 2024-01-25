import { getProblemsRepository } from "@/repositories";
import { Request, Response } from "express";

export async function getProblemService() {
    const response = await getProblemsRepository();
    return response;
}