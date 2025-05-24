const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerOrLogin = async (req, res) => {

  if (!req.body) return res.status(400).json({ error: 'Dados não enviados' });
  let uuid = undefined;
  try {
    uuid = req.body?.uuid
    if (!uuid) return res.status(400).json({ error: 'UUID é obrigatório' });
  } catch (err) {
    return res.status(400).json({ error: 'UUID é obrigatório' });
  }

  try {
    let user = await User.findOne({ uuid });

    if (!user) {
      const token = jwt.sign({ uuid }, process.env.JWT_SECRET, { expiresIn: '365d' });
      user = new User({ uuid, token });
      await user.save();
    }

    res.json({ token: user.token });
  } catch (err) {
    console.error('Erro ao registrar ou autenticar usuário:', err);
    res.status(500).json({ error: 'Erro ao registrar ou autenticar usuário' });
  }
};
