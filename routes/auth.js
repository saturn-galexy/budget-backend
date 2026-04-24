const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// ── SIGNUP ────────────────────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ result: false, error: "Champs manquants" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ result: false, error: "Email ou username déjà utilisé" });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    const token = uid2(32);

    const user = new User({ username, email, password: hash, token });
    await user.save();

    res.json({
      result: true,
      token,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ result: false, error: "Champs manquants" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ result: false, error: "Utilisateur non trouvé" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ result: false, error: "Mot de passe incorrect" });
    }

    // Générer un nouveau token à chaque connexion
    const token = uid2(32);
    user.token = token;
    await user.save();

    res.json({
      result: true,
      token,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

// ── VERIFY TOKEN ──────────────────────────────────────────────────────────────
router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    result: true,
    username: req.user.username,
    email: req.user.email,
    onboardingDone: req.user.onboardingDone
  });
});

router.post("/onboarding-done", authMiddleware, async (req, res) => {
  try {
    req.user.onboardingDone = true;
    await req.user.save();
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;