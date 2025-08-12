import express from "express";
const router = express.Router();

import { addOrder } from "../controller/orderControl.js";
import { addOrderItem } from "../controller/orderControl.js";
import { getOrder } from "../controller/orderControl.js";
import { getOrderId } from "../controller/orderControl.js";
import { updateOrder } from "../controller/orderControl.js";
import { cancelOrder } from "../controller/orderControl.js";
import { delOrder } from "../controller/orderControl.js";

import { adminAuth } from "../controller/adminUserAuth.js";
// import { userAuth } from "../controller/adminUserAuth.js";

// router.use("/order", userAuth);
router.post("/orders", addOrder)
router.post("/orders/:id", addOrderItem);
router.get("/orders", getOrder);
router.get("/orders/:id", getOrderId);
router.put("/orders/:id", cancelOrder);

router.use("/admin", adminAuth)

router.get("/admin/orders", getOrder);
router.put("/admin/orders/:id", updateOrder);
router.delete("/admin/orders/:id", delOrder);

export default router;