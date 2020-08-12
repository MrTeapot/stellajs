import { ErrorMessage } from "./ErrorMessage";

export interface ErrorResponse {
    success: false;
    errors?: ErrorMessage[];
}