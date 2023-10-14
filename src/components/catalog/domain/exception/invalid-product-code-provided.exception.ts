export class InvalidProductCodeProvidedException extends Error {
    constructor(message: string, code: string) {
        super(`${message} - Provided code: ${code}`);
    }
}
