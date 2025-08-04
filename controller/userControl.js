import userVar from "../model/user.js";
import bcrypt from "bcrypt";


// register function
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const existingUser = await userVar.findOne({ email });
      if (existingUser) {
        return res.status(400).json({message: "User already exists with this email."});
      }

      //hash password
      const hashed = await bcrypt.hash(password, 10);

      // hash new users password
      const newUser = new userVar({
        name,
        email,
        password: hashed,
        role: 'user'
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully. Please login.' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error registering user", err })
  }
};

// login function
const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await userVar.findOne({ email });

    if (!checkUser) {
      return res.status(401).json({message: "Invalid email or user not found."});
    }

    // compare passwords
    const match = await bcrypt.compare(password, checkUser.password);
    if (!match) {
      return res.status(401).json({message: "Incorrect password. Please try again."});
    }

    // session
    req.session.user = {
      id: checkUser._id,
      email: checkUser.email,
      role: checkUser.role
    };

    if (checkUser.role === 'user') {
      return res.json({ message: "Logged in as user" });
    } else {
      return res.status(403).json({ message: "Unknown role" });
    }
    res.redirect("/product")

  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error."});
  }
};

// admin login function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await userVar.findOne({ email });
    if (!checkUser) {
      return res.status(401).json({message: "Invalid email or user not found."});
    }

    // compare passwords
    const match = await bcrypt.compare(password, checkUser.password);
    if (!match) {
      return res.status(401).json({message: "Incorrect password. Please try again."});
    }

    if (checkUser.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    // session
    req.session.admin = {
      id: checkUser._id,
      email: checkUser.email,
      role: checkUser.role
    }; 

      res.json({ message: "Logged in as admin" });

  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error."});
  } 
}

export {signUp, logIn, adminLogin};