const express = require('express');
// const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const readJsonData = require('./utils/fs/readJsonData');

const talkerPath = path.resolve(__dirname, './talker.json');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
    const fileContent = await readJsonData(talkerPath);
    return res.status(HTTP_OK_STATUS).json(fileContent);
});

app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const fileContent = await readJsonData(talkerPath);
    const talkerById = fileContent.find((talker) => talker.id === Number(id));
    if (!talkerById) {
     return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerById);
});

function generateToken() {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const token = generateToken();
    return res.status(200).json({ token: token });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
