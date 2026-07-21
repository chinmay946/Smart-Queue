import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { callNextToken, completeToken, getAdminTokens, resetQueue, skipToken } from '../controllers/adminController.js';

const router = express.Router();

router.get('/tokens', adminAuth, getAdminTokens);
router.put('/call-next', adminAuth, callNextToken);
router.put('/skip/:id', adminAuth, skipToken);
router.put('/complete/:id', adminAuth, completeToken);
router.delete('/reset', adminAuth, resetQueue);

export default router;
