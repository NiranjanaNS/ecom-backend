import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import userRoutes from "./router/userRoutes.js";
import prodRoutes from "./router/prodRoutes.js";
import catRoutes from "./router/catRoutes.js";
import cartRoutes from "./router/cartRoutes.js";
import orderRoutes from "./router/orderRoutes.js";

// load env variables
dotenv.config();

// middleware of express
const app = express();

// use .env values
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// middleware setup // application-middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectToDatabase();

// session setup
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
// session middleware // flash message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// routes
app.use(userRoutes);
app.use(prodRoutes);
app.use(catRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// image upload
app.use("/uploads", express.static("uploads"));

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
