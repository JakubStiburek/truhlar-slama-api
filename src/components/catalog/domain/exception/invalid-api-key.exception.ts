export class InvalidApiKeyException extends Error {
    constructor() {
        super(`Invalid API key`);
    }
}
