export class SuccessResponse<T> {
    readonly message: string = '';
    readonly response: T;

    constructor(response?: T, message?: string) {
        this.message = message ||  this.message;
        this.response = response || this.response;
    }
}