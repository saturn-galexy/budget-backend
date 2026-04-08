const express = require("express");
const router = express.Router();
const Envelope = require("../models/envelope");
const authMiddleware = require("../middleware/auth");

// ── GET enveloppes ────────────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const envelopes = await Envelope.find({ owner: req.user._id });
    res.json({ result: true, envelopes });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── POST sauvegarder toutes les enveloppes ────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const envelopes = req.body;
    if (!Array.isArray(envelopes)) {
      return res.status(400).json({ result: false, error: "Format invalide" });
    }

    // Supprimer les anciennes et recréer
    await Envelope.deleteMany({ owner: req.user._id });
    const docs = envelopes.map(env => ({
      owner: req.user._id,
      envelopeId: env.id,
      name: env.name,
      emoji: env.emoji,
      annualGoal: env.annualGoal,
      monthlyProvision: env.monthlyProvision,
      accumulated: env.accumulated,
      color: env.color,
    }));
    await Envelope.insertMany(docs);
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;