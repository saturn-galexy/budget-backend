require("dotenv").config();
const connectDB = require('./models/connection');
connectDB();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ── Middleware ─────────────────────────────────────────────────────────────────
var app = express();
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

// Pour Vercel (serverless)
module.exports = app;

// Pour local (development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}
