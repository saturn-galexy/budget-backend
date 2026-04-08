const mongoose = require("mongoose");

const EnvelopeSchema = new mongoose.Schema({
  owner:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  envelopeId:       { type: String, required: true },
  name:             { type: String, required: true },
  emoji:            { type: String, default: "📦" },
  annualGoal:       { type: Number, default: 0 },
  monthlyProvision: { type: Number, default: 0 },
  accumulated:      { type: Number, default: 0 },
  color:            { type: String, default: "#888" },
}, { timestamps: true });

module.exports = mongoose.model("Envelope", EnvelopeSchema);