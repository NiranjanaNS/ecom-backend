import express from "express";
const router = express.Router();

import { uploads } from "../controller/prodControl.js";
import { getProd } from "../controller/prodControl.js";
import { getProdId } from "../controller/prodControl.js";
import { addProd } from "../controller/prodControl.js";
import { upProd } from "../controller/prodControl.js";
import { delProd } from "../controller/prodControl.js";

import { userAuth } from "../controller/prodControl.js";
import { adminAuth } from "../controller/prodControl.js";

// middleware for session(user)
// router.use('/products', userAuth);

// Routes to get products
router.get("/products", getProd);
router.get("/products/:id", getProdId);

// middleware for session(admin)
router.use('/admin', adminAuth);

// Routes for CRUD of products
router.get("/admin/products", getProd);
router.post("/admin/products", uploads.single('image'), addProd);
router.put("/admin/products/:id", uploads.single('image'), upProd);
router.delete("/admin/products/:id", delProd);


export default router;