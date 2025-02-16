const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_super_segura';

// Middleware de autenticação
const autenticarJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
};

// Criar usuário (POST)
router.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    // Gera o token após o cadastro
    const token = jwt.sign({ id: novoUsuario._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ usuario: novoUsuario, token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: err.message });
  }
});

// Login e geração de token
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email, senha });

    if (!usuario) {
      return res.status(400).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhes: err.message });
  }
});

// Listar todos os usuários (GET) - Protegido com JWT
router.get('/usuarios', autenticarJWT, async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários', detalhes: err.message });
  }
});

// Buscar usuário por ID (GET) - Protegido com JWT
router.get('/usuarios/:id', autenticarJWT, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: err.message });
  }
});

// Atualizar usuário (PUT) - Protegido com JWT
router.put('/usuarios/:id', autenticarJWT, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nome, email, senha },
      { new: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: err.message });
  }
});

// Deletar usuário (DELETE) - Protegido com JWT
router.delete('/usuarios/:id', autenticarJWT, async (req, res) => {
  try {
    const usuarioRemovido = await User.findByIdAndDelete(req.params.id);
    if (!usuarioRemovido) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover usuário', detalhes: err.message });
  }
});

module.exports = router;
