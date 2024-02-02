"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onetime_scripts_1 = require("../controllers/onetime-scripts");
const router = (0, express_1.Router)();
router.get('/default-availability', onetime_scripts_1.createDefaultAvailabilitesForExistingMentors);
exports.default = router;
