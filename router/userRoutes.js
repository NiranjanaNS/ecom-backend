import express from "express";
const router = express.Router();

// import controllers
import { signUp } from "../controller/userControl.js";
import { logIn } from "../controller/userControl.js";
import { adminLogin } from "../controller/userControl.js";

// Routes for user registration and login
router.post("/register", signUp);
router.post("/login", logIn);
router.post("/admin/login", adminLogin);

// middleware to check session
// router.use("/", (req, res, next) => {
//     if (req.session.user) {
//         next();
//     } else {
//         res.status(403).send("Entry restricted");
//     }
// });


// export the router
export default router;
