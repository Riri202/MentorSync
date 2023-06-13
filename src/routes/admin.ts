import { Router } from 'express';

import { getAllAdmins, updateUserRole } from '../controllers/admin';

const router = Router();

// router.route('/').get(getAllAdmins);

router.get('/', (req, res) => res.status(200).send('hello from admin route'))

router.patch('/user/:id', updateUserRole)

export default router;
