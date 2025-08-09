const adminAuth = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.status(403).send("Entry restricted");
  }
};


const userAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).json({ message: "User access denied" });
  }
};


export { adminAuth, userAuth }