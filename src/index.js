const express = require('express');
const fs = require('fs').promises;
const { readTalkerFiles } = require('./utils/readAndWriteFiles');
const authTalker = require('./middlewares/authTalker');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateWatcheAT = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const generateToken = require('./utils/generateToken');
const loginValidation = require('./middlewares/authorization');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// 1 - Crie o endpoint GET /talker
app.get('/talker', async (_req, res) => {
    const talkers = await readTalkerFiles();
    return res.status(200).json(talkers);
});

// 2 --------------->
app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const fileContent = await readTalkerFiles();
    const talkerById = fileContent.find((talker) => talker.id === Number(id));
    if (!talkerById) {
     return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerById);
});

app.post('/talker',
generateToken,
authTalker,
validateName,
validateAge,
validateWatcheAT,
validateRate, async (req, res) => {
  try {
  const fileContent = await readTalkerFiles();
  const newTalker = { id: fileContent.length + 1, ...req.body };
  const allTalkers = JSON.stringify([...fileContent, newTalker]);
  await fs.writeFile('./src/talker', allTalkers);
  res.status(201).json(newTalker);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// requisitos 3 e 4 ------------>
app.post('/login', loginValidation, async (_req, _res) => {
  console.log('oi');
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
