import express from "express";
const router = express.Router();

import { uploads } from "../controller/prodControl.js";
import { getProd } from "../controller/prodControl.js";
import { getProdId } from "../controller/prodControl.js";

router.get("/products", getProd);
router.get("/products/:id", getProdId);

export default router;