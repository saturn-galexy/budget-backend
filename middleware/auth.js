const User = require("../models/user");

module.exports = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  const user = await User.findOne({ token });
  if (!user) return res.status(401).json({ error: "Token invalide" });

  req.user = user;
  next();
};