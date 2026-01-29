"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleOAuth_1 = require("../api/utils/googleOAuth");
const router = (0, express_1.Router)();
router.get('/connect', (req, res) => {
    const oauthClient = (0, googleOAuth_1.getOAuthClient)();
    const url = oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(url);
});
router.get('/callback', async (req, res) => {
    try {
        const oauthClient = (0, googleOAuth_1.getOAuthClient)();
        const code = req.query.code;
        const { tokens } = await oauthClient.getToken(code);
        console.log(tokens);
        res.redirect('/settings?google=connected');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('OAuth failed');
    }
});
exports.default = router;
