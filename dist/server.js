"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const setup_1 = __importDefault(require("./routes/setup"));
const profile_1 = __importDefault(require("./routes/profile"));
const google_1 = __importDefault(require("./routes/google"));
const ConnectToMongo_1 = require("./api/utils/ConnectToMongo");
const corsOptions_1 = __importDefault(require("./configs/corsOptions"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
exports.app.set('trust proxy', 1);
exports.app.use((0, cors_1.default)(corsOptions_1.default));
exports.app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
exports.app.use(express_1.default.json());
exports.app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});
exports.app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Import routes
exports.app.use('/auth', auth_1.default);
exports.app.use('/setup', setup_1.default);
exports.app.use('/profile', profile_1.default);
exports.app.use('/google', google_1.default);
exports.app.use(notFound_1.notFound);
exports.app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== "test") {
    (0, ConnectToMongo_1.connectToMongoDB)().then(() => {
        exports.app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    });
}
