"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuthClient = getOAuthClient;
const googleapis_1 = require("googleapis");
function getOAuthClient() {
    const redirectUri = process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_REDIRECT_URI_PROD
        : process.env.GOOGLE_REDIRECT_URI_DEV;
    console.log("Using redirect URI:", redirectUri);
    return new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
}
