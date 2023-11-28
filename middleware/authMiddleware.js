const jwt = require("jsonwebtoken");

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticação ausente ou mal formatado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token de autenticação ausente" });
  }

  try {
    const secret = process.env.SECRET;
    const decodedToken = jwt.verify(token, secret);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp <= currentTimestamp) {
      return res.status(401).json({ message: "Token expirado" });
    }

    req.user = { id: decodedToken.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};
