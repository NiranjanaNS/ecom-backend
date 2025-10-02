import express from "express";
const router = express.Router();

// import controllers
import { signUp } from "../controller/userControl.js";
import { logIn } from "../controller/userControl.js";
import { changePassword } from "../controller/userControl.js";
import { logout } from "../controller/userControl.js";


import { uploads } from "../controller/userControl.js";

import { getUser } from "../controller/userControl.js";
import { upUser } from "../controller/userControl.js";


import { userAuth } from "../controller/adminUserAuth.js";

// Routes for user registration and login
router.post("/register", signUp);
router.post("/login", logIn);


router.use("/", userAuth)
// user CRUD
router.get("/profile", getUser);
router.put("/profile/upload", uploads.single("image"), upUser);
router.put("/changepassword", changePassword)
router.post("/logout", logout)


// export the router
export default router;
