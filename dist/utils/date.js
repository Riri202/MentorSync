"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get30MinuteIntervals = void 0;
const addMinutes_1 = __importDefault(require("date-fns/addMinutes"));
const format_1 = __importDefault(require("date-fns/format"));
const parse_1 = __importDefault(require("date-fns/parse"));
const get30MinuteIntervals = (startTime, endTime) => {
    const intervals = [];
    const formatStr = 'HH:mm';
    let current = (0, parse_1.default)(startTime, formatStr, new Date());
    const end = (0, parse_1.default)(endTime, formatStr, new Date());
    while (current < end) {
        intervals.push((0, format_1.default)(current, formatStr));
        current = (0, addMinutes_1.default)(current, 30);
    }
    return intervals;
};
exports.get30MinuteIntervals = get30MinuteIntervals;
