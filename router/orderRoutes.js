import express from "express";
const router = express.Router();

import { addOrder, uploads } from "../controller/orderControl.js";
import { addOrderItem } from "../controller/orderControl.js";
import { getOrder } from "../controller/orderControl.js";
import { getOrderId } from "../controller/orderControl.js";
import { updateOrder } from "../controller/orderControl.js";
import { cancelOrder } from "../controller/orderControl.js";
import { delOrder } from "../controller/orderControl.js";
import { getOrderAdmin } from "../controller/orderControl.js";

import { adminAuth } from "../controller/adminUserAuth.js";
import { userAuth } from "../controller/adminUserAuth.js";


router.use(userAuth);

router.post("/", uploads.array("image", 10), addOrder)
router.post("/:id", addOrderItem);
router.get("/", getOrder);
router.get("/:id", getOrderId);
router.put("/:id", cancelOrder);

router.use(adminAuth)

router.get("/admin/orders", getOrderAdmin);
router.put("/admin/orders/:id", updateOrder);
router.delete("/admin/orders/:id", delOrder);

export default router;