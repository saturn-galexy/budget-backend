const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Connexion MongoDB ──────────────────────────────────────────────────────────
const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));
app.use("/budgets", require("./routes/budgets"));
app.use("/envelopes", require("./routes/envelopes"));
app.use("/learned", require("./routes/learned"));
app.use("/settings", require("./routes/settings"));

// ── Route de santé ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Budget API opérationnelle" });
});

// ── Démarrage ──────────────────────────────────────────────────────────────────
module.exports = app;
