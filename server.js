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

app.post('/usuarios', async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body);
        const usuarioSalvo = await novoUsuario.save();
        res.status(201).json(usuarioSalvo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario não encontrada' });
        }
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});