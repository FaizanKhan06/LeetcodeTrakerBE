import { Router } from "express";
import { Problem } from "../models/Problem";

const router = Router();

// Get all
router.get("/", async (_, res) => {
  try {
    const problems = await Problem.find().sort({ number: 1 });
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get one
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Not found" });
    res.json(problem);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const { number, status } = req.body;

    // Check if number already exists
    const existing = await Problem.findOne({ number });
    if (existing) {
      return res.status(400).json({ message: "Problem number already exists" });
    }

    // Auto set dateSolved if status = Solved
    if (status === "Solved"){
      if(!req.body.dateSolved) {
        req.body.dateSolved = new Date().toISOString();
      }
    }else{
      req.body.dateSolved = "";
    }

    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Problem number exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    // Auto set dateSolved if status = Solved
    if (req.body.status === "Solved"){
      if(!req.body.dateSolved) {
        req.body.dateSolved = new Date().toISOString();
      }
    }else{
      req.body.dateSolved = "";
    }

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
