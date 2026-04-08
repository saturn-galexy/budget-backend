const mongoose = require("mongoose");

const LearnedRuleSchema = new mongoose.Schema({
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key:      { type: String, required: true },      // libellé normalisé ou "id:xxx"
  category: { type: String, required: true },
}, { timestamps: true });

// Index unique par owner + key
LearnedRuleSchema.index({ owner: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("LearnedRule", LearnedRuleSchema);