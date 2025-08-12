import userVar from "../model/user.js";
import bcrypt from "bcrypt";
import multer from "multer";

// register function
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userVar.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    //hash password
    const hashed = await bcrypt.hash(password, 10);

    // hash new users password
    const newUser = new userVar({
      name,
      email,
      password: hashed,
      role: "user",
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully. Please login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user", err });
  }
};

// login function
const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await userVar.findOne({ email });

    if(checkUser.status !== "active") {
      return res.status(401).json({ message: "Entry restricted by admin" });
    }

    if (!checkUser) {
      return res
        .status(401)
        .json({ message: "Invalid email or user not found." });
    }

    // compare passwords
    const match = await bcrypt.compare(password, checkUser.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    const user = {
      name: checkUser.name,
      email: checkUser.email,
    };
    
    // session
    req.session.user = {
      id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      password: checkUser.password,
      role: checkUser.role,
    };

    if (checkUser.role === "user") {
      return res.json({ message: "Logged in as user", user });
    } else {
      return res.status(403).json({ message: "Unknown role" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// admin login function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await userVar.findOne({ email });
    if (!checkUser) {
      return res
        .status(401)
        .json({ message: "Invalid email or user not found." });
    }

    // compare passwords
    const match = await bcrypt.compare(password, checkUser.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    if (checkUser.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const admin = {
      name: checkUser.name,
      email: checkUser.email,
    };
    
    // session
    req.session.admin = {
      id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      password: checkUser.password,
      role: checkUser.role,
    };

    res.json({ message: "Logged in as admin", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUserAd = async (req, res) => {
  try {
    const user = await userVar.find({ role: "user" });
    return res.json({ message: "Fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Internal error", err });
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await userVar.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const image = user.image;
    const name = user.name;
    const email = user.email;

    res.status(200).json({ image: image, name: name, email: email });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage: storage });

const upUser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const image = req.file ? req.file.filename : find.image;

    const update = await userVar.findByIdAndUpdate(
      userId,
      { image },
      { new: true }
    );
    console.log(update);
    return res.json({ message: "User details updated successfully", image });
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
};

const loginperm = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    const user = await userVar.findByIdAndUpdate(
      { _id: userId },
      { status: status }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User status updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

export { signUp, logIn, adminLogin };
export { uploads };
export { getUserAd, getUser, upUser, loginperm };