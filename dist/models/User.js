"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true, // TODO: implement reset forgotten password feature
    },
    address: {
        type: String,
    },
    bio: {
        type: String, // TODO: make it possible for users to edit their bios in account page
    },
    occupation: {
        type: String,
        required: true,
    },
    expertise: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'mentor', 'user'],
        default: 'user',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
