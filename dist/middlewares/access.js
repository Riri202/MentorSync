"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOrMentorRole = exports.isUserRole = exports.isMentorRole = exports.isAdminRole = void 0;
const index_1 = require("../constants/index");
const unauthorized = (res) => res.status(403).send({ message: 'You are not authorized to perform this action' });
const isAdminRole = (req, res, next) => {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === index_1.ADMIN_ROLE)
        return next();
    return unauthorized(res);
};
exports.isAdminRole = isAdminRole;
const isMentorRole = (req, res, next) => {
    if (req.user.role === index_1.MENTOR_ROLE)
        return next();
    return unauthorized(res);
};
exports.isMentorRole = isMentorRole;
const isUserRole = (req, res, next) => {
    if (req.user.role === index_1.USER_ROLE)
        return next();
    return unauthorized(res);
};
exports.isUserRole = isUserRole;
const isUserOrMentorRole = (req, res, next) => {
    if (req.user.role === index_1.USER_ROLE || req.user.role === index_1.MENTOR_ROLE)
        return next();
    return unauthorized(res);
};
exports.isUserOrMentorRole = isUserOrMentorRole;
