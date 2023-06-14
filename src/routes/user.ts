import {Router} from 'express'
import { createMentorSchedule, getAllMentors, getMentor, updateMentorSchedule, getMentorSchedule, getMentorTimeSlots, createMentorshipSession } from '../controllers/user'
import { verifyAuth } from '../middlewares/auth'
import { isMentorRole, isUserRole } from '../middlewares/access'

const router = Router()

router.get('/mentors', getAllMentors)
router.get('/mentors/:mentorId', getMentor)
router.post('/mentors/:mentorId/schedule', verifyAuth, isMentorRole, createMentorSchedule)
router.patch('/mentors/:mentorId/schedule', verifyAuth, isMentorRole, updateMentorSchedule)
router.get('/mentors/:mentorId/schedule', verifyAuth, isMentorRole, getMentorSchedule)
router.get('/mentors/:mentorId/timeslots', verifyAuth, isUserRole, getMentorTimeSlots)
router.post('/sessions', verifyAuth, isUserRole, createMentorshipSession)

export default router
