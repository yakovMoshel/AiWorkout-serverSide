"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthClient = void 0;
const googleapis_1 = require("googleapis");
exports.oauthClient = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
