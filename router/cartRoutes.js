import express from "express";
const router = express.Router();

import { addCart } from "../controller/cartController.js";
import { updateCart } from "../controller/cartController.js";
import { deleteCart } from "../controller/cartController.js";
import { deleteCartItem } from "../controller/cartController.js";
import { getCart } from "../controller/cartController.js";
import { getCartItem } from "../controller/cartController.js";

import { userAuth } from "../controller/adminUserAuth.js";

router.use("/cart", userAuth);

router.post("/cart", addCart);
router.put("/cart/:id", updateCart);
router.delete("/cart", deleteCart);
router.delete("/cart/delete/:id", deleteCartItem);
router.get("/cart", getCart);
router.get("/cart/:id", getCartItem);

export default router;
