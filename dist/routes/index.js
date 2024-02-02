"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const admin_1 = __importDefault(require("./admin"));
const onetime_scripts_1 = __importDefault(require("./onetime-scripts"));
const user_1 = __importDefault(require("./user"));
const auth_2 = require("../middlewares/auth");
const access_1 = require("../middlewares/access");
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/', user_1.default);
router.use('/admin', auth_2.verifyAuth, access_1.isAdminRole, admin_1.default);
router.use('/onetime', onetime_scripts_1.default);
exports.default = router;
