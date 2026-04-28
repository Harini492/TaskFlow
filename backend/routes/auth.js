const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔥 SECRET (use .env later)
const JWT_SECRET = "secret123";

// simple in-memory users (no DB)
let users = [];


// =====================
// 🔐 AUTH MIDDLEWARE
// =====================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user data
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};


// =====================
// 📝 REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Missing fields");
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      username,
      password: hashed
    };

    users.push(newUser);

    res.json("User created");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});


// =====================
// 🔑 LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    // 🔥 include username in token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" } // optional but better
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});


// =====================
// 👤 GET CURRENT USER
// =====================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // find user from memory
    const user = users.find(u => u.id === req.user.id);

    if (!user) return res.status(404).json("User not found");

    // don't send password
    res.json({
      id: user.id,
      username: user.username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});


module.exports = router;