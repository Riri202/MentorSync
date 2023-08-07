import { Router } from 'express';
import {
  createMentorSchedule,
  getAllMentors,
  getMentor,
  updateMentorSchedule,
  getMentorSchedule,
  getMentorTimeSlots,
  createMentorshipSession,
  updateSessionStatus,
  getSessions,
  reviewSession,
  getSession
} from '../controllers/user';
import { verifyAuth } from '../middlewares/auth';
import {
  isMentorRole,
  isUserRole,
  isUserOrMentorRole,
} from '../middlewares/access';

const router = Router();

router.get('/mentors', getAllMentors);
router.get('/mentors/:mentorId', getMentor);

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
router.get('/sessions', verifyAuth, isUserOrMentorRole, getSessions);
router.patch('/sessions/:sessionId', verifyAuth, isMentorRole, updateSessionStatus);
router.get('/sessions/:sessionId', verifyAuth, isUserOrMentorRole, getSession);
router.post('/sessions/:sessionId/review', verifyAuth, isUserRole, reviewSession);

export default router;
