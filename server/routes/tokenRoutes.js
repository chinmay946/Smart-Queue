import express from 'express';
import auth from '../middleware/auth.js';
import { bookToken, cancelToken, getLiveQueue, getMyTokens } from '../controllers/tokenController.js';

const router = express.Router();

router.post('/book', auth, bookToken);
router.get('/my', auth, getMyTokens);
router.get('/live', auth, getLiveQueue);
router.delete('/:id', auth, cancelToken);

export default router;
