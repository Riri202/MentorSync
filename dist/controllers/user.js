"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewedSessions = exports.reviewSession = exports.getExpiredSessionsForReview = exports.getSession = exports.getSessions = exports.updateSessionStatus = exports.getMentorTimeSlots = exports.createMentorshipSession = exports.getMentorSchedule = exports.updateMentorSchedule = exports.createMentorSchedule = exports.getUser = exports.getAllMentors = void 0;
const endOfDay_1 = __importDefault(require("date-fns/endOfDay"));
const startOfDay_1 = __importDefault(require("date-fns/startOfDay"));
const User_1 = __importDefault(require("../models/User"));
const index_1 = require("../constants/index");
const Session_1 = __importDefault(require("../models/Session"));
// import TimeSlot, { TimeSlotDocument } from '../models/TimeSlot';
const getDay_1 = __importDefault(require("date-fns/getDay"));
const date_1 = require("../utils/date");
const Availability_1 = __importDefault(require("../models/Availability"));
const Review_1 = __importDefault(require("../models/Review"));
const addMinutes_1 = __importDefault(require("date-fns/addMinutes"));
const format_1 = __importDefault(require("date-fns/format"));
const checkIfUserOrMentorExists = (res, id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield User_1.default.findOne({
        _id: id,
        role,
    }).select('-password');
    if (!existing)
        return res.status(404).send({
            message: `${role.charAt(0).toUpperCase()}${role.slice(1)} not found`,
        });
});
const getAllMentors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_1.default.find({ role: index_1.MENTOR_ROLE }, {}, { sort: { createdAt: -1 } }).select('-password');
        res.status(200).send(data);
    }
    catch (error) {
        console.log('GET_ALL_MENTORS_ERROR', error);
        res.status(500).send({ message: error.message });
    }
});
exports.getAllMentors = getAllMentors;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId)
        return res.status(400).send({ message: 'User id is required' });
    try {
        const data = yield User_1.default.findById(userId).select('-password');
        res.status(200).send({ data });
    }
    catch (error) {
        console.log('GET_USER_ERROR', error);
        res.status(500).send({ message: error.message });
    }
});
exports.getUser = getUser;
const createMentorSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = req.params;
    const { startTime, endTime, dayOfWeek } = req.body;
    //TODO: make sure start and end time are in correct 'hh:mm' format
    const timeSlots = (0, date_1.get30MinuteIntervals)(startTime, endTime);
    try {
        const data = yield new Availability_1.default({
            dayOfWeek,
            startTime,
            endTime,
            mentor: mentorId,
            timeSlots,
        }).save();
        // if (schedule) {
        //   intervals.map(async (item) => {
        //     const data = await new TimeSlot({
        //       time: item,
        //       mentor: mentorId,
        //       dayOfWeek,
        //       availability: schedule._id,
        //     }).save();
        //     promises.push(data);
        //   });
        // }
        res.status(201).send({ data });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createMentorSchedule = createMentorSchedule;
const updateMentorSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startTime, endTime, isAvailable, availabilityId } = req.body;
    const { mentorId } = req.params;
    const userId = req.user._id.toString();
    if (userId !== mentorId)
        return res.status(403).send({ message: 'You are not allowed to do this' });
    const timeSlots = (0, date_1.get30MinuteIntervals)(startTime, endTime);
    try {
        const data = yield Availability_1.default.findOneAndUpdate({ _id: availabilityId }, { $set: { startTime, endTime, timeSlots, isAvailable } }, { new: true }).exec();
        res.status(200).send({ data });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});
exports.updateMentorSchedule = updateMentorSchedule;
const getMentorSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = req.params;
    try {
        const data = yield Availability_1.default.find({ mentor: mentorId })
            .populate('mentor', '-password')
            .sort({ dayOfWeek: 'asc' });
        res.status(200).send({ data });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});
exports.getMentorSchedule = getMentorSchedule;
const createMentorshipSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentor, note, sessionDate, time } = req.body;
    if (!mentor || !time || !sessionDate)
        return res
            .status(400)
            .send({ message: 'Mentor, session date and time slot are required' });
    yield checkIfUserOrMentorExists(res, mentor, 'mentor');
    const mentee = req.user._id;
    const dayOfWeek = (0, getDay_1.default)(new Date(sessionDate));
    const toDate = (0, endOfDay_1.default)(new Date(sessionDate));
    const fromDate = (0, startOfDay_1.default)(new Date(sessionDate));
    const availableTimeslots = [];
    const schedule = yield Availability_1.default.find({ mentor, dayOfWeek });
    if (!schedule.length)
        return res.status(400).send({
            message: 'Sorry, this mentor is not available for the selected date',
        });
    const bookedSessionsForSelectedDate = yield Session_1.default.find({
        mentor,
        sessionDate: { $gte: fromDate, $lte: toDate },
    });
    if (bookedSessionsForSelectedDate.length) {
        schedule[0].timeSlots.forEach((slot) => {
            if (!bookedSessionsForSelectedDate.some((session) => String(session === null || session === void 0 ? void 0 : session.time) === String(slot)))
                availableTimeslots.push(slot);
        });
    }
    if (bookedSessionsForSelectedDate.length &&
        !availableTimeslots.includes(time))
        return res.status(400).send({
            message: 'Sorry, this mentor is not available for the selected time',
        });
    try {
        const data = yield new Session_1.default({
            mentor,
            mentee,
            note,
            sessionDate,
            time,
        }).save();
        res.status(200).send({ message: 'Session created successfully', data });
    }
    catch (error) {
        console.log('CREATE_SESSION_ERROR', error);
        res.status(500).send({ message: error.message });
    }
});
exports.createMentorshipSession = createMentorshipSession;
const getMentorTimeSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = req.params;
    const { date } = req.query;
    const dayOfWeek = (0, getDay_1.default)(new Date(date));
    const data = [];
    const toDate = (0, endOfDay_1.default)(new Date(date));
    const fromDate = (0, startOfDay_1.default)(new Date(date));
    try {
        const schedule = yield Availability_1.default.find({ mentor: mentorId, dayOfWeek });
        if (!schedule.length)
            return res
                .status(200)
                .send({ message: 'Mentor is not available this day of the week' });
        const bookedSessionsForSelectedDate = yield Session_1.default.find({
            mentor: mentorId,
            sessionDate: { $gte: fromDate, $lte: toDate },
        });
        if (bookedSessionsForSelectedDate.length) {
            schedule[0].timeSlots.forEach((slot) => {
                if (!bookedSessionsForSelectedDate.some((session) => String(session === null || session === void 0 ? void 0 : session.time) === String(slot)))
                    data.push(slot);
            });
            return res.status(200).send({ data });
        }
        return res.status(200).send({ data: schedule[0].timeSlots });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.getMentorTimeSlots = getMentorTimeSlots;
const updateSessionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.params;
    const { status } = req.body;
    if (!status)
        return res.status(400).send({
            message: 'Please provide session status',
        });
    try {
        const data = yield Session_1.default.findByIdAndUpdate(sessionId, {
            $set: { status },
        }).exec();
        return res
            .status(200)
            .send({ message: `Session succesfully ${status}`, data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.updateSessionStatus = updateSessionStatus;
const getFiltersForSessions = (role, userId, filters) => {
    if (role === index_1.USER_ROLE) {
        return Object.assign(Object.assign({}, filters), { mentee: userId });
    }
    return Object.assign(Object.assign({}, filters), { mentor: userId });
};
const getSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = req.query;
    const data = { accepted: {}, rejected: {}, pending: {}, expired: {} };
    const sessionExpirationTime = (0, addMinutes_1.default)(new Date(), 30);
    try {
        const ungroupedAccepted = yield Session_1.default.find(getFiltersForSessions(role, userId, {
            sessionDate: { $gt: sessionExpirationTime },
            status: 'accepted',
        }))
            .populate('mentor', '-password')
            .populate('mentee', '-password')
            .sort({ sessionDate: -1 });
        const ungroupedExpired = yield Session_1.default.find(getFiltersForSessions(role, userId, {
            sessionDate: { $lte: sessionExpirationTime },
            status: 'accepted',
        }))
            .populate('mentor', '-password')
            .populate('mentee', '-password')
            .sort({ sessionDate: -1 });
        const ungroupedRejected = yield Session_1.default.find(getFiltersForSessions(role, userId, {
            status: 'rejected',
        }))
            .populate('mentor', '-password')
            .populate('mentee', '-password')
            .sort({ sessionDate: -1 });
        const ungroupedPending = yield Session_1.default.find(getFiltersForSessions(role, userId, {
            status: 'pending',
        }))
            .populate('mentor', '-password')
            .populate('mentee', '-password')
            .sort({ sessionDate: -1 });
        data.accepted = groupSessionsByDate(ungroupedAccepted);
        data.expired = groupSessionsByDate(ungroupedExpired);
        data.pending = groupSessionsByDate(ungroupedPending);
        data.rejected = groupSessionsByDate(ungroupedRejected);
        return res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
        console.log(error);
    }
});
exports.getSessions = getSessions;
const groupSessionsByDate = (sessions) => {
    const groupedSessions = {};
    sessions.forEach((session) => {
        const date = (0, format_1.default)(new Date(session.sessionDate), 'yyyy-MM'); // Extract the date without time
        if (!groupedSessions[date]) {
            groupedSessions[date] = [];
        }
        groupedSessions[date].push(session);
    });
    return groupedSessions;
};
const getSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, _id: userId } = req.user;
    const { sessionId } = req.params;
    let data;
    try {
        if (role === index_1.USER_ROLE) {
            data = yield Session_1.default.findOne({ mentee: userId, _id: sessionId })
                .populate('mentor', '-password')
                .populate('mentee', '-password');
        }
        else
            data = yield Session_1.default.findOne({ mentor: userId, _id: sessionId })
                .populate('mentor', '-password')
                .populate('mentee', '-password');
        return res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.getSession = getSession;
const getExpiredSessionsForReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId } = req.user;
    const sessionExpirationTime = (0, addMinutes_1.default)(new Date(), 30);
    try {
        const data = yield Session_1.default.aggregate([
            {
                $match: {
                    mentee: userId,
                    sessionDate: { $lte: sessionExpirationTime },
                    status: 'accepted',
                },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'session',
                    as: 'reviews',
                },
            },
            {
                $match: {
                    reviews: { $size: 0 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentor',
                    foreignField: '_id',
                    as: 'mentorInfo',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentee',
                    foreignField: '_id',
                    as: 'menteeInfo',
                },
            },
            {
                $project: {
                    note: 1,
                    time: 1,
                    sessionDate: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    mentee: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: '$menteeInfo',
                                    in: {
                                        _id: '$$this._id',
                                        firstname: '$$this.firstname',
                                        lastname: '$$this.lastname',
                                        email: '$$this.email',
                                        address: '$$this.address',
                                        bio: '$$this.bio',
                                        occupation: '$$this.occupation',
                                        expertise: '$$this.expertise',
                                        role: '$$this.role',
                                        createdAt: '$$this.createdAt',
                                        updatedAt: '$$this.updatedAt',
                                    },
                                },
                            },
                            0,
                        ],
                    },
                    mentor: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: '$mentorInfo',
                                    in: {
                                        _id: '$$this._id',
                                        firstname: '$$this.firstname',
                                        lastname: '$$this.lastname',
                                        email: '$$this.email',
                                        address: '$$this.address',
                                        bio: '$$this.bio',
                                        occupation: '$$this.occupation',
                                        expertise: '$$this.expertise',
                                        role: '$$this.role',
                                        createdAt: '$$this.createdAt',
                                        updatedAt: '$$this.updatedAt',
                                    },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
        ]);
        res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.getExpiredSessionsForReview = getExpiredSessionsForReview;
const reviewSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentor, rating, review, session } = req.body;
    const mentee = req.user._id;
    try {
        const data = yield new Review_1.default({
            session,
            mentor,
            mentee,
            rating,
            review,
        }).save();
        return res
            .status(200)
            .send({ message: 'Session reviewed successfully', data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.reviewSession = reviewSession;
const getReviewedSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = req.query;
    let data;
    try {
        if (role === index_1.USER_ROLE) {
            data = yield Review_1.default.find({ mentee: userId })
                .populate('mentor', '-password')
                .populate('mentee', '-password')
                .populate('session');
        }
        else
            data = yield Review_1.default.find({ mentor: userId })
                .populate('mentor', '-password')
                .populate('mentee', '-password')
                .populate('session');
        return res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.getReviewedSessions = getReviewedSessions;
