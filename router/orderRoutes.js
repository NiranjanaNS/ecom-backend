import express from "express";
const router = express.Router();

import { addOrder } from "../controller/orderControl.js";
import { getOrder } from "../controller/orderControl.js";
import { getOrderId } from "../controller/orderControl.js";
import { updateOrder } from "../controller/orderControl.js";
import { cancelOrder } from "../controller/orderControl.js";
import { delOrder } from "../controller/orderControl.js";

import { adminAuth } from "../controller/adminUserAuth.js";
// import { userAuth } from "../controller/adminUserAuth.js";

// router.use("/order", userAuth);

router.post("/order", addOrder);
router.get("/order", getOrder);
router.get("/order/:id", getOrderId);
router.put("/order/:id", cancelOrder);

router.use("/admin", adminAuth)

router.get("/admin/order", getOrder);
router.put("/admin/order/:id", updateOrder);
router.delete("/admin/order/:id", delOrder);

export default router;