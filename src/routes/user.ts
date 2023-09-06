import { Router } from 'express';
import {
  createMentorSchedule,
  getAllMentors,
  getUser,
  updateMentorSchedule,
  getMentorSchedule,
  getMentorTimeSlots,
  createMentorshipSession,
  updateSessionStatus,
  getSessions,
  reviewSession,
  getSession,
  getExpiredSessionsForReview,
  getReviewedSessions
} from '../controllers/user';
import { verifyAuth } from '../middlewares/auth';
import {
  isMentorRole,
  isUserRole,
  isUserOrMentorRole,
} from '../middlewares/access';

const router = Router();

router.get('/mentors', getAllMentors);
router.get('/users/:userId', getUser);

router.post(
  '/mentors/:mentorId/schedule',
  verifyAuth,
  isMentorRole,
  createMentorSchedule
);
router.patch(
  '/mentors/:mentorId/schedule',
  verifyAuth,
  isMentorRole,
  updateMentorSchedule
);
router.get(
  '/mentors/:mentorId/schedule',
  verifyAuth,
  isUserOrMentorRole,
  getMentorSchedule
);

router.get(
  '/mentors/:mentorId/timeslots',
  verifyAuth,
  isUserRole,
  getMentorTimeSlots
);

router.post('/sessions', 
verifyAuth, 
isUserRole, 
createMentorshipSession);
router.get('/sessions', getSessions);
router.get('/sessions/expired', verifyAuth, isUserRole, getExpiredSessionsForReview);
router.post('/sessions/review', verifyAuth, isUserRole, reviewSession);
router.get('/sessions/review', verifyAuth, isUserOrMentorRole, getReviewedSessions);
router.patch('/sessions/:sessionId', verifyAuth, isMentorRole, updateSessionStatus);
router.get('/sessions/:sessionId', verifyAuth, isUserOrMentorRole, getSession);

export default router;
