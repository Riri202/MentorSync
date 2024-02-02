"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mentorSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDemotedToUser: {
        type: Boolean,
        default: false,
    },
    isDemotedToUserAt: {
        type: Date,
    },
    isDemotedToUserBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Mentor', mentorSchema);
