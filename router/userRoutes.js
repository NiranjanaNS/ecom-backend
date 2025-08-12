import express from "express";
const router = express.Router();

// import controllers
import { signUp } from "../controller/userControl.js";
import { logIn } from "../controller/userControl.js";
import { adminLogin } from "../controller/userControl.js";


import { uploads } from "../controller/userControl.js";

import { getUserAd } from "../controller/userControl.js";
import { getUser } from "../controller/userControl.js";
import { upUser } from "../controller/userControl.js";

import { loginperm } from "../controller/userControl.js";


import { adminAuth } from "../controller/adminUserAuth.js";

// Routes for user registration and login
router.post("/register", signUp);
router.post("/login", logIn);

// Route for admin login
router.post("/admin/login", adminLogin);


// user CRUD
router.get("/user/profile", getUser);
router.put("/user/profile/upload", uploads.single("image"), upUser);


// middleware for session(admin) // router-middleware
router.use("/admin", adminAuth);

// Route to get userlist by admin
router.get("/admin/users", getUserAd);
router.put("/admin/users/:id", loginperm);

// export the router
export default router;
