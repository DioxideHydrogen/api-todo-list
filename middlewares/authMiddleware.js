const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader)
    return res.status(401).json({ error: 'Token ausente' });
  // Verifica se o token começa com 'Bearer '
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token ausente' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ uuid: payload.uuid });
    if (!user) return res.status(401).json({ error: 'Usuário inválido' });

    req.user = user; // salva o usuário para os próximos middlewares/controllers
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
