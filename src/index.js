const express = require('express');
const fs = require('fs').promises;
const { readTalkerFiles } = require('./utils/readAndWriteFiles');
const tokenAuth = require('./middlewares/tokenAuth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateWatchedAT = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const loginValidation = require('./middlewares/loginValidation');
const validateTalk = require('./middlewares/validateTalk');
const validateRateExist = require('./middlewares/validateRateExist');

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
// requisitos 3 e 4 ------------>
app.post('/login', loginValidation, async (_req, _res) => {
  // console.log('oi');
});

app.post('/talker',
tokenAuth,
validateName,
validateAge,
validateTalk,
validateWatchedAT,
validateRateExist,
validateRate,
 async (req, res) => {
  try {
  const fileContent = await readTalkerFiles();
  const newTalker = { id: fileContent.length + 1, ...req.body };
  fileContent.push(newTalker);
  await fs.writeFile('./src/talker.json', JSON.stringify(fileContent, null, 2));
  return res.status(201).json(newTalker);
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
});

app.put('/talker/:id',
tokenAuth,
validateName,
validateAge,
validateTalk,
validateWatchedAT,
validateRateExist,
validateRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
   const talkers = await readTalkerFiles();
   const talkerUpdate = talkers.findIndex((talker) => talker.id === Number(id));
   if (talkerUpdate === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
   }
   talkers[talkerUpdate].name = name;
   talkers[talkerUpdate].age = age;
   talkers[talkerUpdate].talk.watchedAt = talk.watchedAt;
   talkers[talkerUpdate].talk.rate = talk.rate;
   await fs.writeFile('./src/talker.json', JSON.stringify(talkers), null, 2);
   return res.status(200).json(talkers[talkerUpdate]);
});

app.delete('/talker/:id', tokenAuth, async (req, res) => {
    const { id } = req.params;
    const talkers = await readTalkerFiles();
    const deleteTalker = talkers.findIndex((talker) => talker.id === Number(id));
    if (deleteTalker === -1) {
       res.status(401).send();
    }
    talkers.splice(deleteTalker, 1);
    await fs.writeFile('./src/talker.json', JSON.stringify(talkers), null, 2);
    return res.status(204).send();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
