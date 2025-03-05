const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Protected Route - Get User Profile
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;

