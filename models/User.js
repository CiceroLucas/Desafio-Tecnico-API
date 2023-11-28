const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const telefoneSchema = new mongoose.Schema({
  numero: String,
  ddd: String,
});

const userSchema = new mongoose.Schema(
  {
    nome: String,
    email: String,
    senha: String,
    telefones: [telefoneSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
