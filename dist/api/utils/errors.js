"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    status;
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.status = 400;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    status;
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends Error {
    status;
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
