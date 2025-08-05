import express from 'express';
const router = express.Router();

import { addCart } from '../controller/cartController.js';

router.post("/cart", addCart);

export default router;