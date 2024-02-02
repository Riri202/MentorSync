"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    session: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },
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
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Review', reviewSchema);
