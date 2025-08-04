import express from 'express';
const router = express.Router();

import { getCategories } from '../controller/catController.js';
import { addCat } from '../controller/catController.js';
import { upCat } from '../controller/catController.js';
import { delCat } from '../controller/catController.js';

// Route to get category
router.get('/categories', getCategories);

// Routes for CRUD of category
router.get('/admin/categories', getCategories);
router.post('/admin/categories', addCat);
router.put('/admin/categories/:id', upCat);
router.delete('/admin/categories/:id', delCat);

export default router;