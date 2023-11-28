const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(422).json({ message: "O nome é obrigatório." });
    }

    if (!email || email.trim() === "") {
      return res.status(422).json({ message: "O email é obrigatório." });
    }

    if (!senha || senha.trim() === "") {
      return res.status(422).json({ message: "A senha é obrigatória." });
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res
        .status(422)
        .json({ message: "Já existe um usuário cadastrado com esse email." });
    }

    const newUser = new User({
      nome,
      email,
      senha,
      telefones,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
      expiresIn: "30m",
    });

    res.status(201).json({
      id: newUser._id,
      data_criacao: newUser.createdAt,
      data_atualizacao: newUser.updatedAt,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar o usuário." });
  }
};

exports.signin = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || email.trim() === "") {
    return res.status(422).json({ message: "O email é obrigatório." });
  }
  if (!senha || senha.trim() === "") {
    return res.status(422).json({ message: "A senha é obrigatória." });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const checkPassword = await bcrypt.compare(senha, user.senha);
    if (!checkPassword) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "30m",
    });

    user.ultimoLogin = new Date();
    await user.save();

    res.status(200).json({
      id: user._id,
      data_criacao: user.createdAt,
      data_atualizacao: user.updatedAt,
      ultimo_login: user.ultimoLogin,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao realizar a autenticação." });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId, "-senha");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar o usuário." });
  }
};
