"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
router.get('/', (req, res) => res.status(200).send('hello from admin route'));
router.patch('/user/:id', admin_1.updateUserRole);
router.delete('/review/:reviewId', admin_1.deleteSessionReview); //TODO: might change to a post request.
exports.default = router;
