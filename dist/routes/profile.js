"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const profileController_1 = require("../api/controller/profileController");
const fileFilter_1 = require("../api/utils/fileFilter");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: fileFilter_1.storage, fileFilter: fileFilter_1.fileFilter });
router.put('/edit', auth_1.authenticate, upload.single('image'), async (req, res, next) => {
    console.log("REQ FILE:", req.file); // הדפסה
    try {
        await (0, profileController_1.updateProfile)(req, res);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
