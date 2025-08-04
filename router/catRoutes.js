import express from 'express';
const router = express.Router();

import { getCategories } from '../controller/catController.js';

router.get('/categories', getCategories);

export default router;