const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const Ticket = require('../models/ticket'); 


// Criar um novo ingresso
router.post('/tickets', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;
    const novoIngresso = new Ticket({ nome, preco, quantidade });
    await novoIngresso.save();
    res.status(201).json(novoIngresso);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar ingresso', detalhes: err.message });
  }
});

// Listar todos os ingressos
router.get('/', async (req, res) => {
  try {
    const ingressos = await Ticket.find();
    res.json(ingressos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar ingressos', detalhes: err.message });
  }
});

// Buscar um ingresso por ID
router.get('/:id', async (req, res) => {
  try {
    const ingresso = await Ticket.findById(req.params.id);
    if (!ingresso) {
      return res.status(404).json({ erro: 'Ingresso não encontrado' });
    }
    res.json(ingresso);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar ingresso', detalhes: err.message });
  }
});

// Atualizar um ingresso por ID
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;
    const ingressoAtualizado = await Ticket.findByIdAndUpdate(
      req.params.id,
      { nome, preco, quantidade },
      { new: true }
    );

    if (!ingressoAtualizado) {
      return res.status(404).json({ erro: 'Ingresso não encontrado' });
    }
    res.json(ingressoAtualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar ingresso', detalhes: err.message });
  }
});


// Rota DELETE /tickets/:id (exige autenticação e permissão de admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const ingresso = await Ticket.findByIdAndDelete(req.params.id);
    if (!ingresso) {
      return res.status(404).json({ erro: 'Ingresso não encontrado' });
    }
    res.json({ mensagem: 'Ingresso removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover ingresso', detalhes: err.message });
  }
});

module.exports = router;
