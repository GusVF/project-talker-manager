const crypto = require('crypto');

function generateToken(_req, res) {
  const token = crypto.randomBytes(8).toString('hex');
  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  // console.log(token);
  return token;
}

module.exports = generateToken;
