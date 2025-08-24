"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const setup_1 = __importDefault(require("./routes/setup"));
const connectToMongo_1 = require("./api/utils/connectToMongo");
const corsOptions_1 = __importDefault(require("./configs/corsOptions"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express_1.default.json());
// Import routes
app.use('/auth', auth_1.default);
app.use('/setup', setup_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
(0, connectToMongo_1.connectToMongoDB)()
    .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
    .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
});
