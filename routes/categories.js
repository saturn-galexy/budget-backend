const express = require("express");
const router = express.Router();
const Category = require("../models/categorie");
const DEFAULT_CATEGORIES = require("../data/defaultCategories");

// Seed si vide
async function seedIfEmpty() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log("Categories seeded.");
  }
}

// GET all categories
router.get("/", async (req, res) => {
  try {
    await seedIfEmpty();
    const categories = await Category.find().sort({ family: 1, name: 1 });
    res.json({ result: true, categories });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// POST create
router.post("/", async (req, res) => {
  const { name, emoji, color, family } = req.body;
  if (!name || !emoji || !color || !family) {
    return res.status(400).json({ result: false, error: "Missing fields" });
  }
  try {
    const category = await Category.create({ name, emoji, color, family, isDefault: false });
    res.json({ result: true, category });
  } catch (err) {
    res.status(400).json({ result: false, error: err.message });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  const { name, emoji, color, family } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, emoji, color, family },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ result: false, error: "Not found" });
    res.json({ result: true, category });
  } catch (err) {
    res.status(400).json({ result: false, error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ result: false, error: "Not found" });
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;