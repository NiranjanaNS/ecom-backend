import express from "express";
const router = express.Router();

import { adminLogin } from "../controller/userControl.js";
import { getUserAd } from "../controller/userControl.js";
import { loginperm } from "../controller/userControl.js";

import { adminAuth } from "../controller/adminUserAuth.js";


// Route for admin login
router.post("/login", adminLogin);

// middleware for session(admin) // router-middleware
router.use(adminAuth);

// Route to get userlist by admin
router.get("/users", getUserAd);
router.put("/users/:id", loginperm);

export default router;