"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timeslotSchema = new mongoose_1.Schema({
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    dayOfWeek: {
        type: Number,
        required: true
    },
    availability: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Availability',
        required: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('TimeSlot', timeslotSchema);
