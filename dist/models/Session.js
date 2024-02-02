"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    note: {
        type: String
    },
    // timeSlot: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'TimeSlot',
    //   required: true,
    // },
    time: {
        type: String,
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Session', sessionSchema);
