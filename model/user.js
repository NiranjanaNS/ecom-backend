import mongoose from "mongoose";

// user Schema
const userSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// user model
const userVar = mongoose.model("userInfo", userSchema);

// export model
export default userVar;
