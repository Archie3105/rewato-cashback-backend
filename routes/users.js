// routes/users.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create / signup user
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone) return res.status(400).json({ message: "Name and phone are required." });

    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: "User with this phone already exists." });

    const user = new User({ name, phone, email, password, cashbackEligible: false });
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List users (for backend display)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update cashback for a user (simple endpoint to add cashback)
router.post("/:id/add-cashback", async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cashbackTotal = (user.cashbackTotal || 0) + Number(amount || 0);
    await user.save();
    res.json({ message: "Cashback updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
