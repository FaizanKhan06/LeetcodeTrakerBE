import { Router } from "express";
import { CheatSheet } from "../models/CheatSheet";
import { auth } from "../middleware/auth";

const router = Router();

// Get all cheatsheets for logged-in user
router.get("/", auth, async (req: any, res) => {
  try {
    const cheatsheets = await CheatSheet.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cheatsheets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get one cheatsheet
router.get("/:id", auth, async (req: any, res) => {
  try {
    const cheatsheet = await CheatSheet.findOne({ _id: req.params.id, user: req.user._id });
    if (!cheatsheet) return res.status(404).json({ error: "Not found" });
    res.json(cheatsheet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create cheatsheet
router.post("/", auth, async (req: any, res) => {
  try {
    req.body.user = req.user._id;

    const cheatsheet = await CheatSheet.create(req.body);
    res.status(201).json(cheatsheet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update cheatsheet
router.put("/:id", auth, async (req: any, res) => {
  try {
    const updated = await CheatSheet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete cheatsheet
router.delete("/:id", auth, async (req: any, res) => {
  try {
    const deleted = await CheatSheet.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;