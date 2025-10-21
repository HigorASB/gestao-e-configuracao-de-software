const mongoose = require('mongoose');

// Define o Schema (estrutura) para a coleção 'Pessoas'
const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    idade: {
      type: Number,
      required: true
    }
});

// Cria e exporta o Modelo
module.exports = mongoose.model('Usuario', UsuarioSchema);