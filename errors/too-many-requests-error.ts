import { AppError } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Demasiadas solicitudes, por favor intente más tarde') {
        super(message, 429, 'TOO_MANY_REQUESTS');
        this.name = 'TooManyRequestsError';
    }
}