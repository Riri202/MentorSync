"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signin = exports.signup = exports.createDefaultAvailabilites = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const User_1 = __importDefault(require("../models/User"));
const date_1 = require("../utils/date");
const Availability_1 = __importDefault(require("../models/Availability"));
const generateToken = (id) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const createDefaultAvailabilites = (mentor) => {
    const startTime = '09:00';
    const endTime = '17:00';
    const defaultAvailabilities = [];
    for (let i = 0; i < 7; i++) {
        const timeSlots = (0, date_1.get30MinuteIntervals)(startTime, endTime);
        const newAvailability = {
            dayOfWeek: i,
            startTime,
            endTime,
            mentor,
            timeSlots,
            isAvailable: (i === 0 || i === 6) ? false : true,
        };
        defaultAvailabilities.push(newAvailability);
    }
    return defaultAvailabilities;
};
exports.createDefaultAvailabilites = createDefaultAvailabilites;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, address, bio, occupation, expertise, role, } = req.body;
    if (!email || !password)
        return res.status(400).send({ message: 'email and pasword required' });
    const foundEmail = yield User_1.default.findOne({ email });
    if (foundEmail)
        return res
            .status(400)
            .send({ message: 'account with this email already exists' });
    const hashedPassword = yield bcrypt.hash(password, constants_1.BCRYPT_SALT);
    if (!hashedPassword)
        return res.status(500).send({ message: 'password hashing unsuccessful' });
    try {
        const newUser = yield new User_1.default({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            address,
            bio,
            occupation,
            expertise,
            role,
        }).save();
        if (newUser) {
            const token = generateToken(String(newUser._id));
            const data = {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                address: newUser.address,
                bio: newUser.bio,
                occupation: newUser.occupation,
                expertise: newUser.expertise,
                role: newUser.role,
                token,
            };
            // if user is a mentor, create default mentor schedule
            if (newUser.role === constants_1.MENTOR_ROLE) {
                const defaultAvailabilities = (0, exports.createDefaultAvailabilites)(newUser._id);
                yield Availability_1.default.insertMany(defaultAvailabilities);
            }
            return res.status(200).send(Object.assign({ message: 'sign-up successful' }, data));
        }
    }
    catch (error) {
        console.log('SIGN_UP_ERROR', error);
        return res.status(500).send({ error: error.message });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.status(400).send({ message: 'Incorrect email' });
    try {
        const match = yield bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!match)
            return res.status(400).send({ message: 'Incorrect password' });
        const token = generateToken(String(user === null || user === void 0 ? void 0 : user._id));
        const data = {
            id: user === null || user === void 0 ? void 0 : user._id,
            firstname: user === null || user === void 0 ? void 0 : user.firstname,
            lastname: user === null || user === void 0 ? void 0 : user.lastname,
            email: user === null || user === void 0 ? void 0 : user.email,
            address: user === null || user === void 0 ? void 0 : user.address,
            bio: user === null || user === void 0 ? void 0 : user.bio,
            occupation: user === null || user === void 0 ? void 0 : user.occupation,
            expertise: user === null || user === void 0 ? void 0 : user.expertise,
            role: user === null || user === void 0 ? void 0 : user.role,
            token,
        };
        return res.status(200).send(Object.assign({ message: 'sign-in succesful' }, data));
    }
    catch (error) {
        console.log('SIGN_IN_ERROR', error);
        return res.status(500).send({ error: error.message });
    }
});
exports.signin = signin;
