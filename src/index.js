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

// requisito 08 ------------>
app.get('/talker/search', 
tokenAuth,
 async (req, res) => {
      const { q } = req.query;
      // console.log(req.query);
      const talkers = await readTalkerFiles();
      if (q) {
        const filterByQ = talkers.filter((talker) => talker.name.includes(q));
        return res.status(200).json(filterByQ);
      }
      if (!q) {
        return res.status(200).json(talkers);
      }
      return res.status(200).end();
});

// requisito 01 --------------->
app.get('/talker', async (_req, res) => {
    const talkers = await readTalkerFiles();
    return res.status(200).json(talkers);
});

// requisito  02 --------------->
app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const fileContent = await readTalkerFiles();
    const talkerById = fileContent.find((talker) => talker.id === Number(id));
    if (!talkerById) {
     return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerById);
});

// requisitos 03 e 04 ------------>
app.post('/login', loginValidation, async (_req, _res) => {
  // console.log('oi');
});

// requisito 05 ------------->
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

// requisito 06 ------------>
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

// requisito 07 --------------->
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
