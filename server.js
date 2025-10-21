require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conexão com MongoDB bem-sucedida!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
    res.send('API Simples Node.js, Express, MongoDB/Mongoose funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});