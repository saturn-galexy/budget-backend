const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  txId:     { type: String, required: true, unique: true }, // id original du CSV
  date:     { type: String, required: true },
  label:    { type: String, required: true },
  rawLabel: { type: String },
  amount:   { type: Number, required: true },
  account:  { type: String, required: true },
  source:   { type: String, enum: ["bourso", "amex"], required: true },
  csvFile: { type: String, default: null },
  hidden:   { type: Boolean, default: false },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);