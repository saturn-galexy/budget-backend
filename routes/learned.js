const express = require("express");
const router = express.Router();
const LearnedRule = require("../models/learnedRule");
const authMiddleware = require("../middleware/auth");

// ── GET règles apprises ───────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const rules = await LearnedRule.find({ owner: req.user._id });
    const result = {};
    rules.forEach(r => { result[r.key] = r.category; });
    res.json({ result: true, learned: result });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── POST sauvegarder règles ───────────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const rules = req.body;
    for (const [key, category] of Object.entries(rules)) {
      await LearnedRule.findOneAndUpdate(
        { owner: req.user._id, key },
        { category },
        { upsert: true, new: true }
      );
    }
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── DELETE supprimer une règle ────────────────────────────────────────────────
router.delete("/:key", authMiddleware, async (req, res) => {
  try {
    await LearnedRule.deleteOne({
      owner: req.user._id,
      key: decodeURIComponent(req.params.key)
    });
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;