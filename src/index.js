const express = require('express');
const fs = require('fs').promises;
const path = require('path');
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

app.get('/talker', async (req, res) =>{
    const fileContent = await readJsonData(talkerPath);
    return res.status(HTTP_OK_STATUS).json(fileContent);
});

app.listen(PORT, () => {
  console.log('Ola, tudo bem?');
});
