import {Router} from 'express'
import { createSessionTimeSlots, getAllMentors, getMentor } from '../controllers/user'
import { verifyAuth } from '../middlewares/auth'
import { isMentorRole } from '../middlewares/access'

const router = Router()

router.get('/mentors', getAllMentors)
router.get('/mentors/:mentorId', getMentor)
router.post('/timeslot', verifyAuth, isMentorRole, createSessionTimeSlots )
router.post('/sessions', verifyAuth, )

export default router