import { Router } from 'express';

import { updateUserRole, deleteSessionReview } from '../controllers/admin';

const router = Router();


router.get('/', (req, res) => res.status(200).send('hello from admin route'))

router.patch('/user/:id', updateUserRole)

router.delete('/review/:reviewId', deleteSessionReview); //TODO: might change to a post request.

export default router;
