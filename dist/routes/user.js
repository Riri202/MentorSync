"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const access_1 = require("../middlewares/access");
const router = (0, express_1.Router)();
router.get('/mentors', user_1.getAllMentors);
router.get('/users/:userId', user_1.getUser);
// router.post(
//   '/mentors/:mentorId/schedule',
//   verifyAuth,
//   isMentorRole,
//   createMentorSchedule
// );
router.patch('/mentors/:mentorId/schedule', auth_1.verifyAuth, access_1.isMentorRole, user_1.updateMentorSchedule);
router.get('/mentors/:mentorId/schedule', auth_1.verifyAuth, access_1.isUserOrMentorRole, user_1.getMentorSchedule);
router.get('/mentors/:mentorId/timeslots', auth_1.verifyAuth, access_1.isUserRole, user_1.getMentorTimeSlots);
router.post('/sessions', auth_1.verifyAuth, access_1.isUserRole, user_1.createMentorshipSession);
router.get('/sessions', user_1.getSessions);
router.get('/sessions/expired', auth_1.verifyAuth, access_1.isUserRole, user_1.getExpiredSessionsForReview);
router.post('/sessions/review', auth_1.verifyAuth, access_1.isUserRole, user_1.reviewSession);
router.get('/sessions/review', user_1.getReviewedSessions);
router.patch('/sessions/:sessionId', auth_1.verifyAuth, access_1.isMentorRole, user_1.updateSessionStatus);
router.get('/sessions/:sessionId', auth_1.verifyAuth, access_1.isUserOrMentorRole, user_1.getSession);
exports.default = router;
