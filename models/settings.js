const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  monthlyRevenue: { type: Number, default: 0 },
  accounts:       { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Sexxs