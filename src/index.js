const express = require('express');
const { readTalkerFiles } = require('./utils/readAndWriteFiles');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./utils/validateEmail');

const app = express();
app.use(express.json());
// const router = express.Router();

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// 1 - Crie o endpoint GET /talker
app.get('/talker', async (_req, res) => {
    const talkers = await readTalkerFiles();
    return res.status(200).json(talkers);
});

// 2 - Crie o endpoint GET /talker/:id
app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const fileContent = await readTalkerFiles();
    const talkerById = fileContent.find((talker) => talker.id === Number(id));
    if (!talkerById) {
     return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerById);
});

// 3 - Crie o endpoint POST /login
// 4 - Adicione as validações para o endpoint /login
const getAuthorization = (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });

    if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    const token = generateToken();
    return res.status(200).json({ token });
};

app.post('/login', getAuthorization);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
