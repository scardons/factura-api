"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get('/authorize', auth_controller_1.getAuthUrl);
router.get('/callback', auth_controller_1.handleCallback);
exports.default = router;
