const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const authMiddleware = require("../middleware/auth");

// ── GET toutes les transactions ───────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      owner: req.user._id,
      hidden: false,
    }).sort({ date: -1 });
    res.json({ result: true, transactions });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── POST importer des transactions ────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const txs = req.body;
    if (!Array.isArray(txs)) {
      return res.status(400).json({ result: false, error: "Format invalide" });
    }

    let imported = 0;
    for (const tx of txs) {
      // upsert : insert si n'existe pas déjà
      const result = await Transaction.updateOne(
        { txId: tx.id, owner: req.user._id },
        {
          $setOnInsert: {
            txId: tx.id,
            date: tx.date,
            label: tx.label,
            rawLabel: tx.rawLabel,
            amount: tx.amount,
            account: tx.account,
            source: tx.source,
            owner: req.user._id,
          }
        },
        { upsert: true }
      );
      if (result.upsertedCount > 0) imported++;
    }

    res.json({ result: true, imported, total: txs.length });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── PATCH masquer une transaction ─────────────────────────────────────────────
router.patch("/:txId/hide", authMiddleware, async (req, res) => {
  try {
    await Transaction.updateOne(
      { txId: req.params.txId, owner: req.user._id },
      { hidden: true }
    );
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;