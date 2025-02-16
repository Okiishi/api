const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Campo de senha
  role: { type: String, enum: ['user', 'admin'], default: 'user' } 
});

module.exports = mongoose.model('user', usuarioSchema);
