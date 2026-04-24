const mongoose = require("mongoose");

const CategorieSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true, trim: true },
  emoji:     { type: String, required: true },
  color:     { type: String, required: true },
  family:    { type: String, required: true, enum: ["Vie courante", "Loisirs", "Épargne & divers"] },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Categorie", CategorieSchema);