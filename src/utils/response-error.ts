import { StatusCode } from '../enums/status-code-enum';

export default class ResponseError extends Error {
    status: StatusCode;

    constructor(message: string, status: StatusCode) {
        super(message);
        this.status = status;
    }
}
