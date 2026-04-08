const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");
const authMiddleware = require("../middleware/auth");

// ── GET budgets ───────────────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const doc = await Budget.findOne({ owner: req.user._id });
    const budgets = doc ? Object.fromEntries(doc.budgets) : {};
    res.json({ result: true, budgets });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── POST sauvegarder budgets ──────────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const budgets = req.body;
    await Budget.findOneAndUpdate(
      { owner: req.user._id },
      { budgets },
      { upsert: true, new: true }
    );
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;