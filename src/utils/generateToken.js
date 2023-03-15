const crypto = require('crypto');

function generateToken(_req, res, next) {
  const token = crypto.randomBytes(8).toString('hex');
  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  next();
  return token;
}

module.exports = generateToken;
