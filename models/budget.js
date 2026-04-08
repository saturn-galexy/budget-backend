const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budgets:  { type: Map, of: Number, default: {} }, // { "Alimentation": 400, "Loyer": 1200 }
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);