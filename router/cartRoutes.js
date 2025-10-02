import express from "express";
const router = express.Router();

import { addCart } from "../controller/cartController.js";
import { updateCart } from "../controller/cartController.js";
import { deleteCart } from "../controller/cartController.js";
import { deleteCartItem } from "../controller/cartController.js";
import { getCart } from "../controller/cartController.js";
import { getCartItem } from "../controller/cartController.js";

import { userAuth } from "../controller/adminUserAuth.js";

router.use("/", userAuth);

router.post("/", addCart);
router.put("/:id", updateCart);
router.delete("/", deleteCart);
router.delete("/delete/:id", deleteCartItem);
router.get("/", getCart);
router.get("/:id", getCartItem);

export default router;
