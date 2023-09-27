import { Router } from "express";
import { createDefaultAvailabilitesForExistingMentors } from "../controllers/onetime-scripts";

const router = Router();

router.get('/default-availability', createDefaultAvailabilitesForExistingMentors)

export default router