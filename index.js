// // app.js (updated)
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import https from "https";
// import fs from "fs";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const HTTP_PORT = process.env.PORT || 3000;
// const HTTPS_PORT = 3443;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
// app.options("*", cors());

// app.use(express.json());

// // --------- MONGOOSE & SCHEMA ---------
// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) {
//   console.error("⚠️  MONGO_URI not set. Set environment variable MONGO_URI.");
//   // We continue so developer can still run without DB in dev, but endpoints will error.
// }

// mongoose
//   .connect(MONGO_URI || "", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connected to MongoDB Atlas"))
//   .catch((err) => console.warn("⚠ MongoDB connection warning:", err.message));

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true, required: true },
//   phone: String,
//   password: String, // for demo only. In prod hash it.
//   cashbackAmount: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// // Serve the React build
// const buildPath = path.join(__dirname, "../frontend/dist");
// if (fs.existsSync(buildPath)) {
//   app.use(express.static(buildPath));
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(buildPath, "index.html"));
// });


// // ---------- API routes ----------
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Node server is running fine!" });
// });

// // Signup: create user
// app.post("/api/signup", async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     console.log(req.body)
//     if (!email || !password) return res.status(400).json({ error: "email and password required" });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ error: "User already exists" });

//     const user = new User({ name, email, phone, password });
//     await user.save();
//     res.json({ message: "User created", userId: user._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all users (for admin/dev)
// app.get("/api/users", async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get single user
// app.get("/api/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add cashback manually
// app.put("/api/users/:id/cashback", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (typeof amount !== "number") return res.status(400).json({ error: "amount must be a number" });

//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cashbackAmount += amount;
//     await user.save();
//     res.json({ message: "Cashback updated", total: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Scan endpoint: simple cashback rule (demo)
// app.post("/api/scan", async (req, res) => {
//   try {
//     const { userId, code } = req.body;
//     // In real app verify code, check fraud, etc.
//     if (!userId) return res.status(400).json({ error: "userId required" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Simple demo rule: random cashback between 10 and 50
//     // const added = Math.floor(Math.random() * 41) + 10; // 10..50 cashback
//     const added = Math.floor(Math.random() * 0) + 0; // no cashback
//     user.cashbackAmount += added;
//     await user.save();

//     res.json({ addedAmount: added, totalAmount: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Fallback to frontend for SPA
// app.get(/.*/, (req, res) => {
//   const indexFile = path.join(buildPath, "index.html");
//   if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
//   res.status(404).send("Not found");
// });

// // HTTPS server uses your key/cert if available
// try {
//   const options = {
//     key: fs.readFileSync(path.join(__dirname, "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
//   };
//   https.createServer(options, app).listen(HTTPS_PORT, () => {
//     console.log(`✅ Secure Server running on https://localhost:${HTTPS_PORT}`);
//   });
// } catch (err) {
//   console.log("⚠ HTTPS certs not found or invalid, skipping HTTPS server start.");
// }

// // Start HTTP server
// app.listen(HTTP_PORT, () => {
//   console.log(`⚠ Insecure Server running on http://localhost:${HTTP_PORT}`);
// });

// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import https from "https";
// import fs from "fs";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const HTTP_PORT = process.env.PORT || 3000;
// const HTTPS_PORT = 3443;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ CORS for all domains (safe for testing; tighten for production)
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
// app.options(/.*/, cors()); // ✅ Express 5 syntax

// app.use(express.json());

// // ---------- MongoDB Connection ----------
// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) {
//   console.warn("⚠️ MONGO_URI not set — continuing without DB.");
// }

// mongoose
//   .connect(MONGO_URI || "", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connected to MongoDB Atlas"))
//   .catch((err) => console.warn("⚠ MongoDB connection warning:", err.message));

// // ---------- Schema ----------
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true, required: true },
//   phone: String,
//   password: String,
//   cashbackAmount: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// // ---------- Serve React build ----------
// const buildPath = path.join(__dirname, "../frontend/dist");
// if (fs.existsSync(buildPath)) {
//   app.use(express.static(buildPath));
// }

// // ---------- API Routes ----------
// app.get("/api/test", (req, res) => {
//   res.json({ message: "✅ Node server is running fine!" });
// });

// // Signup route
// app.post("/api/signup", async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ error: "Email and password required" });

//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(409).json({ error: "User already exists" });

//     const user = new User({ name, email, phone, password });
//     await user.save();
//     res.json({ message: "User created", userId: user._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all users
// app.get("/api/users", async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update cashback
// app.put("/api/users/:id/cashback", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (typeof amount !== "number")
//       return res.status(400).json({ error: "Amount must be a number" });

//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cashbackAmount += amount;
//     await user.save();
//     res.json({ message: "Cashback updated", total: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Scan endpoint
// app.post("/api/scan", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) return res.status(400).json({ error: "userId required" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Simple demo rule: random cashback between 10 and 50
//     // const added = Math.floor(Math.random() * 41) + 10; // 10..50 cashback
//     const added = Math.floor(Math.random() * 0) + 0; // Example: no cashback
//     user.cashbackAmount += added;
//     await user.save();

//     res.json({ addedAmount: added, totalAmount: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Fallback for React Router (SPA) ----------
// // ✅ FIXED: Express 5 requires regex, not "*"
// app.get(/.*/, (req, res) => {
//   const indexFile = path.join(buildPath, "index.html");
//   if (fs.existsSync(indexFile)) {
//     res.sendFile(indexFile);
//   } else {
//     res.status(404).send("Frontend build not found");
//   }
// });

// // ---------- HTTPS ----------
// try {
//   const options = {
//     key: fs.readFileSync(path.join(__dirname, "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
//   };
//   https.createServer(options, app).listen(HTTPS_PORT, () => {
//     console.log(`✅ Secure Server running on https://localhost:${HTTPS_PORT}`);
//   });
// } catch {
//   console.log("⚠ No HTTPS certs found — skipping HTTPS.");
// }

// // ---------- HTTP ----------
// app.listen(HTTP_PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${HTTP_PORT}`);
// });



// import express from "express";    // signup working
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import https from "https";
// import fs from "fs";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // ---------------- Middleware (MUST BE FIRST) ----------------
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
// app.options(/.*/, cors()); // Preflight handling

// app.use(express.json()); // ✅ parse JSON body
// app.use(express.urlencoded({ extended: true })); // optional for forms

// // ---------------- Ports ----------------
// const HTTP_PORT = process.env.PORT || 3000;
// const HTTPS_PORT = 3443;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ---------------- MongoDB Connection ----------------
// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) {
//   console.warn("⚠️ MONGO_URI not set — continuing without DB.");
// }

// mongoose
//   .connect(MONGO_URI || "", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connected to MongoDB Atlas"))
//   .catch((err) => console.warn("⚠ MongoDB connection warning:", err.message));

// // ---------------- Schema ----------------
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true, required: true },
//   phone: String,
//   password: String,
//   cashbackAmount: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });
// const User = mongoose.models.User || mongoose.model("User", userSchema);

// // ---------------- Serve React build ----------------
// const buildPath = path.join(__dirname, "../frontend/dist");
// if (fs.existsSync(buildPath)) {
//   app.use(express.static(buildPath));
// }

// // ---------------- API Routes ----------------

// // Test route
// app.get("/api/test", (req, res) => {
//   res.json({ message: "✅ Node server is running fine!" });
// });

// // Signup route
// app.post("/api/signup", async (req, res) => {
//   try {
//     console.log("📩 Incoming signup body:", req.body);

//     // Defensive check: ensure body parsed
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ error: "Empty body received — make sure Content-Type: application/json" });
//     }

//     const { name, email, phone, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     const user = new User({ name, email, phone, password });
//     await user.save();
//     res.json({ message: "User created successfully", userId: user._id });
//   } catch (err) {
//     console.error("❌ Signup Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all users
// app.get("/api/users", async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update cashback
// app.put("/api/users/:id/cashback", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (typeof amount !== "number")
//       return res.status(400).json({ error: "Amount must be a number" });

//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cashbackAmount += amount;
//     await user.save();
//     res.json({ message: "Cashback updated", total: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Scan endpoint
// app.post("/api/scan", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) return res.status(400).json({ error: "userId required" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Simple demo rule: random cashback between 10 and 50
//     const added = Math.floor(Math.random() * 41) + 10; // 10..50 cashback
//     // const added = Math.floor(Math.random() * 0) + 0;
//     user.cashbackAmount += added;
//     await user.save();

//     res.json({ addedAmount: added, totalAmount: user.cashbackAmount });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------------- React SPA fallback ----------------
// app.get(/.*/, (req, res) => {
//   const indexFile = path.join(buildPath, "index.html");
//   if (fs.existsSync(indexFile)) {
//     res.sendFile(indexFile);
//   } else {
//     res.status(404).send("Frontend build not found");
//   }
// });

// // ---------------- HTTPS (local only) ----------------
// try {
//   const keyPath = path.join(__dirname, "key.pem");
//   const certPath = path.join(__dirname, "cert.pem");
//   if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
//     const options = {
//       key: fs.readFileSync(keyPath),
//       cert: fs.readFileSync(certPath)
//     };
//     https.createServer(options, app).listen(HTTPS_PORT, () => {
//       console.log(`✅ Secure Server running on https://localhost:${HTTPS_PORT}`);
//     });
//   } else {
//     console.log("⚠ No HTTPS certs found — skipping HTTPS.");
//   }
// } catch {
//   console.log("⚠ HTTPS setup skipped.");
// }

// // ---------------- HTTP (Render main port) ----------------
// app.listen(HTTP_PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${HTTP_PORT}`);
// });   signup working .....


import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = 3443;

// ---------- File Paths ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- CORS ----------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(/.*/, cors());

// ---------- MongoDB ----------
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.warn("⚠ MongoDB connection warning:", err.message));

// ---------- User Schema ----------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  password: String,
  cashbackAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ---------- React Build Path ----------
const buildPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// ---------- ROUTES ----------

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend running fine!" });
});

// ✅ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const user = new User({ name, email, phone, password });
    await user.save();
    res.json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ error: "Email and new password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Cashback
app.put("/api/users/:id/cashback", async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== "number")
      return res.status(400).json({ error: "Amount must be a number" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cashbackAmount += amount;
    await user.save();
    res.json({ message: "Cashback updated", total: user.cashbackAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Scan Route
app.post("/api/scan", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const added = Math.floor(Math.random() * 41) + 10;
    user.cashbackAmount += added;
    await user.save();

    res.json({ addedAmount: added, totalAmount: user.cashbackAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SPA fallback for React Router
app.get(/.*/, (req, res) => {
  const indexFile = path.join(buildPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send("Frontend build not found");
  }
});

// ---------- HTTPS ----------
try {
  const options = {
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
  };
  https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`✅ Secure Server running on https://localhost:${HTTPS_PORT}`);
  });
} catch {
  console.log("⚠ No HTTPS certs found — skipping HTTPS.");
}

// ---------- HTTP ----------
app.listen(HTTP_PORT, () => {
  console.log(`🚀 Server running on http://localhost:${HTTP_PORT}`);
});


