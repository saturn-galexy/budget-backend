const express = require("express");
const router = express.Router();
const Settings = require("../models/settings");
const authMiddleware = require("../middleware/auth");

// ── GET settings ──────────────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const settings = await Settings.findOne({ owner: req.user._id });
    res.json({ result: true, settings: settings || {} });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── POST sauvegarder settings ─────────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { monthlyRevenue, accounts } = req.body;
    await Settings.findOneAndUpdate(
      { owner: req.user._id },
      { monthlyRevenue, accounts },
      { upsert: true, new: true }
    );
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;