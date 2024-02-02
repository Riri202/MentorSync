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
exports.createDefaultAvailabilitesForExistingMentors = void 0;
const auth_1 = require("./auth");
const User_1 = __importDefault(require("../models/User"));
const Availability_1 = __importDefault(require("../models/Availability"));
const createDefaultAvailabilitesForExistingMentors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMentors = yield User_1.default.find({ role: 'mentor' });
        const newAvailabilities = allMentors.reduce((initial, mentor) => {
            const defaultAvailabilities = (0, auth_1.createDefaultAvailabilites)(mentor._id);
            return initial.concat(defaultAvailabilities);
        }, []);
        const data = yield Availability_1.default.insertMany(newAvailabilities);
        res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.createDefaultAvailabilitesForExistingMentors = createDefaultAvailabilitesForExistingMentors;
