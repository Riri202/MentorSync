"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const availabilitySchema = new mongoose_1.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeSlots: {
        type: Array,
        required: true
    }
}, { timestamps: true });
availabilitySchema.add({ isAvailable: { type: Boolean, default: true } });
exports.default = (0, mongoose_1.model)('Availability', availabilitySchema);
