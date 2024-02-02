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
exports.deleteSessionReview = exports.updateUserRole = exports.getAllAdmins = void 0;
const User_1 = __importDefault(require("../models/User"));
const User_2 = __importDefault(require("../models/User"));
const getAllAdmins = () => console.log('Get admins');
exports.getAllAdmins = getAllAdmins;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !id)
        return res.status(400).send({ message: 'user id and role is required' });
    try {
        const user = yield User_1.default.findOneAndUpdate({ _id: id }, { $set: { role } }, { new: true }).exec();
        if (user) {
            const data = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                address: user.address,
                bio: user.bio,
                occupation: user.occupation,
                expertise: user.expertise,
                role: user.role,
            };
            return res
                .status(200)
                .send({ message: 'user role updated successfully', data });
        }
        return res.status(404).send({ message: 'User not found' });
    }
    catch (error) {
        console.log('UPDATE_USER_ROLE_ERROR', error);
        return res.status(500).send({ message: error.message });
    }
});
exports.updateUserRole = updateUserRole;
const deleteSessionReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    try {
        yield User_2.default.deleteOne({ _id: reviewId });
        return res.status(200).send({ message: 'Review successfully deleted' });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.deleteSessionReview = deleteSessionReview;
