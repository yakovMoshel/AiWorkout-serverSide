"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../api/utils/errors");
const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Error:', err.message);
    if (err instanceof errors_1.BadRequestError ||
        err instanceof errors_1.UnauthorizedError ||
        err instanceof errors_1.NotFoundError) {
        res.status(err.status).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.errorHandler = errorHandler;
