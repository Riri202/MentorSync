import {Router} from 'express'
import auth from '../routes/auth'
import admin from '../routes/admin'
import onetimeScripts from '../routes/onetime-scripts'
import usersAndMentors from '../routes/user'
import {verifyAuth} from '../middlewares/auth'
import {isAdminRole} from '../middlewares/access'

const router = Router()

router.use('/auth', auth)
router.use('/', usersAndMentors)
router.use('/admin', verifyAuth, isAdminRole, admin)
router.use('/onetime', onetimeScripts)

export default router