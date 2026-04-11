import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { spawn } from "child_process";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const SECRET_KEY = "mysecretkey";

/* Middleware */
app.use(cors());
app.use(express.json());

/////////////////////////////////////////////////////
/* MongoDB Connection */
/////////////////////////////////////////////////////

mongoose.connect("mongodb+srv://sharmamanishsharmaabc49_db_user:xkDjZ7KIjUQrLfmK@cluster0.xixatky.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

/////////////////////////////////////////////////////
/* User Schema */
/////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  username: String,
  password: String,

  // 🔥 ADD THIS
  preferences: [
    {
      category: String,
      time: Number
    }
  ]
});
const User = mongoose.model("User", userSchema);

/////////////////////////////////////////////////////
/* SIGNUP API */
/////////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/////////////////////////////////////////////////////
/* LOGIN API */
/////////////////////////////////////////////////////

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/////////////////////////////////////////////////////
/* VERIFY TOKEN */
/////////////////////////////////////////////////////

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Session expired, login again" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Session expired, login again" });
    }

    req.user = decoded;
    next();
  });
};

/////////////////////////////////////////////////////
/* RECOMMEND API */
/////////////////////////////////////////////////////

const { spawn } = require("child_process");

app.post("/recommend", verifyToken, (req, res) => {
  try {
    const { temp, humidity, category } = req.body;

    // run JS script using node
    const py = spawn("node", ["predict.js", temp, humidity, category]);

    let data = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (err) => {
      console.error("JS error:", err.toString());
    });

    py.on("close", (code) => {
      try {
        const jsonOutput = JSON.parse(data.trim()); // direct parse
        res.json(jsonOutput);
      } catch (error) {
        console.error("Parse error:", error.message);
        res.status(500).json({
          message: "Failed to parse JS output",
          raw: data,
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// save preference
const savePreference = async (selectedCategory) => {
  try {
    await axios.post("https://indian-tourism-1-go4d.onrender.com/savePreference", {
      userId,
      category: selectedCategory,
      time: Date.now() // 🔥 add this
    });
  } catch (err) {
    console.error(err);
  }
};
 // get preference
   
 app.get("/getPreference/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching for user:", userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Preferences:", user.preferences);

    res.json(user.preferences || []);

  } catch (err) {
    console.error("GET PREF ERROR:", err);
    res.status(500).json({ message: "Error fetching preference" });
  }
});

/////////////////////////////////////////////////////
/* 🔥 HOTELS API (NEW) */
/////////////////////////////////////////////////////
// 👇 YAHAN LIKHNA (HOTELS API ke upar)

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
// hotels API
// hotels API
app.get("/hotels", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Lat/Lng missing" });
  }

  // 🔥 Direct Google search link
  const searchLink = `https://www.google.com/search?q=hotels+near+${lat},${lng}`;
  const mapLink = `https://www.google.com/maps/search/hotels/@${lat},${lng},14z`;

  res.json({
    searchLink,
    mapLink
  });
});
/////////////////////////////////////////////////////
/* START SERVER */
/////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
