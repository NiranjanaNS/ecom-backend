import express from "express";
const router = express.Router();

// import controllers
import { signUp } from "../controller/userControl.js";
import { logIn } from "../controller/userControl.js";
import { adminLogin } from "../controller/userControl.js";
import { getUserAd } from "../controller/userControl.js";

// Routes for user registration and login
router.post("/register", signUp);
router.post("/login", logIn);

// Route for admin login
router.post("/admin/login", adminLogin);

// // middleware to check session
// router.use("/", (req, res, next) => {
//     if (req.session.admin) {
//         next();
//     } else {
//         res.status(403).send("Entry restricted");
//     }
// });

// Route to get userlist by admin
router.get("/admin/users", getUserAd);

// export the router
export default router;
