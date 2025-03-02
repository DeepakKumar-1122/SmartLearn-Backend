import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    const token = auth.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.log(error, error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;
