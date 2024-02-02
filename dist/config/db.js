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
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt = __importStar(require("bcrypt"));
const index_1 = require("../constants/index");
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(String(process.env.MONGO_URI));
        console.log(`mongoDB connected: ${conn.connection.host}`);
        yield createFirstAdmin();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.connectToDB = connectToDB;
const createFirstAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const existingAdmins = yield User_1.default.find({ role: 'admin' });
    if (existingAdmins.length)
        return;
    try {
        const hashedPassword = yield bcrypt.hash(String(process.env.ADMIN_PASSWORD), index_1.BCRYPT_SALT);
        if (!hashedPassword) {
            console.log('password hashing unsuccessful');
            return;
        }
        const admin = new User_1.default({
            firstname: process.env.ADMIN_FIRSTNAME,
            lastname: process.env.ADMIN_LASTNAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            address: process.env.ADMIN_ADDRESS,
            bio: process.env.ADMIN_BIO,
            occupation: process.env.ADMIN_OCCUPATION,
            expertise: process.env.ADMIN_EXPERTISE,
            role: process.env.ADMIN_ROLE,
        });
        yield admin.save();
        console.log('First admin created succesfully');
    }
    catch (error) {
        console.log('create first admin error', error);
    }
});
