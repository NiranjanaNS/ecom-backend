import express from "express";
const router = express.Router();

// import controllers
import { signUp } from "../controller/userControl.js";
import { logIn } from "../controller/userControl.js";
import { adminLogin } from "../controller/userControl.js";
import { getUserAd } from "../controller/userControl.js";

import { adminAuth } from "../controller/adminUserAuth.js";

// Routes for user registration and login
router.post("/register", signUp);
router.post("/login", logIn);

// Route for admin login
router.post("/admin/login", adminLogin);

// middleware for session(admin) // router-middleware
router.use("/admin", adminAuth);

// Route to get userlist by admin
router.get("/admin/users", getUserAd);

// export the router
export default router;
