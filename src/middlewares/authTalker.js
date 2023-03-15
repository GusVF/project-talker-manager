// const generateToken = require('../utils/generateToken');

const authTalker = ((req, res, next) => {
  // generateToken();
  const { authorization } = req.headers;
  if (!authorization || authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido!' });
  }
  next();
});

module.exports = authTalker;
