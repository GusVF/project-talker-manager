const validateRateExist = ((req, res, next) => {
  const { talk } = req.body;
  if (!talk.rate && talk.rate !== 0) {
   return res.status(400)
  .json({ message: 'O campo "rate" é obrigatório' });
  }
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
});

module.exports = validateRateExist;