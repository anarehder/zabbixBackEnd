import { ApplicationError } from "../protocols";

export function invalidInputError(details: string[]): ApplicationInvalidateInputError {
    return {
        name: "InvalidInputError",
        message: "Invalid data",
        details,
    };
}

type ApplicationInvalidateInputError = ApplicationError & {
    details: string[];
};