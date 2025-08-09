import express from "express";
const router = express.Router();

import { getCategories } from "../controller/catController.js";
import { addCat } from "../controller/catController.js";
import { upCat } from "../controller/catController.js";
import { delCat } from "../controller/catController.js";

import { adminAuth } from "../controller/adminUserAuth.js";

// Route to get category
router.get("/categories", getCategories);

// middleware for session(admin)
router.use("/admin", adminAuth);

// Routes for CRUD of category
router.get("/admin/categories", getCategories);
router.post("/admin/categories", addCat);
router.put("/admin/categories/:id", upCat);
router.delete("/admin/categories/:id", delCat);

export default router;
