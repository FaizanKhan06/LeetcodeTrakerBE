import { Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });
        
        const user = await User.create({ name, email, password });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Update User
router.put("/me", auth, async (req: any, res) => {
    try {
        const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
        const user = req.user;
        
        // Update name
        if (name) user.name = name;
        
        // Update email
        if (email && email !== user.email) {
            if (!currentPassword) return res.status(400).json({ error: "Current password required to change email" });
            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) return res.status(400).json({ error: "Invalid current password" });
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: "Email already in use" });
            user.email = email;
        }
        
        // Update password
        if (newPassword || confirmPassword) {
            if (!currentPassword) return res.status(400).json({ error: "Current password required to change password" });
            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) return res.status(400).json({ error: "Invalid current password" });
            if (newPassword !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });
            user.password = newPassword;
        }
        
        await user.save();
        res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User
router.delete("/me", auth, async (req: any, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required to delete account" });

        const valid = await bcrypt.compare(password, req.user.password);
        if (!valid) return res.status(400).json({ error: "Invalid password" });

        await req.user.remove();
        res.json({ ok: true, message: "Account deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
