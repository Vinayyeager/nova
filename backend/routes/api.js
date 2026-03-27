import express from 'express';
import { chat, explain, fix, optimize, convert } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/explain', explain);
router.post('/fix', fix);
router.post('/optimize', optimize);
router.post('/convert', convert);

export default router;
