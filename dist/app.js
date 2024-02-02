"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const index_1 = __importDefault(require("./routes/index"));
const db_1 = require("./config/db");
// TODO:  implement video call appointments too. set up appointments and use socket.io to inform mentors of new appointments
// TODO: incorperate a paid mentorship session feature
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: "rita_maria-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true
}));
// routes
app.use('/', index_1.default);
// connect to database
(0, db_1.connectToDB)();
app.listen(port, () => console.log(`free mentors server listening on port ${port}`));
