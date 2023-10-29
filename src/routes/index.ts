import {Router} from 'express'
import auth from './auth'
import admin from './admin'
import onetimeScripts from './onetime-scripts'
import usersAndMentors from './user'
import {verifyAuth} from '../middlewares/auth'
import {isAdminRole} from '../middlewares/access'

const router = Router()

router.use('/auth', auth)
router.use('/', usersAndMentors)
router.use('/admin', verifyAuth, isAdminRole, admin)
router.use('/onetime', onetimeScripts)

export default router