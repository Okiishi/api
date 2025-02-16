const mongoose = require('mongoose');
const express = require('express');
const Purchase = require('../models/purchase');
const Ticket = require('../models/ticket');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Criar uma nova compra (POST)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { ticketId, quantidade } = req.body;
        const usuario = req.userId; // Pegando ID do usuário autenticado

        // Verificar se o ID do ingresso é válido
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ erro: 'ID de ingresso inválido' });
        }

        // Verificar se a quantidade é um número válido e maior que 0
        if (isNaN(quantidade) || quantidade <= 0) {
            return res.status(400).json({ erro: 'Quantidade inválida. Deve ser um número maior que 0.' });
        }

        // Verificar se o ingresso existe
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ erro: 'Ingresso não encontrado' });
        }

        // Verificar se ticket.quantidadeDisponivel é um número válido
        if (isNaN(ticket.quantidadeDisponivel)) {
            return res.status(500).json({ erro: 'Quantidade do ingresso inválida no banco de dados' });
        }

        // Verificar se há ingressos suficientes disponíveis
        if (ticket.quantidadeDisponivel < quantidade) {
            return res.status(400).json({ erro: 'Ingressos insuficientes disponíveis' });
        }

        // Criar a compra com o ID correto do ingresso
        const compra = new Purchase({
            usuario,
            ticket: ticket._id,
            quantidade
        });

        await compra.save();

        // Atualizar a quantidade de ingressos disponíveis
        ticket.quantidadeDisponivel -= quantidade;
        await ticket.save();

        res.status(201).json(compra);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao processar compra', detalhes: err.message });
    }
});

// Listar todas as compras de um usuário (GET)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const compras = await Purchase.find({ usuario: req.userId }).populate('ticket');
        res.json(compras);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar compras', detalhes: err.message });
    }
});

// Buscar compra por ID (GET)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ erro: 'ID de compra inválido' });
        }
        const compra = await Purchase.findById(req.params.id).populate('ticket');
        if (!compra) {
            return res.status(404).json({ erro: 'Compra não encontrada' });
        }
        res.json(compra);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar compra', detalhes: err.message });
    }
});

// Cancelar compra (DELETE)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ erro: 'ID de compra inválido' });
        }
        const compra = await Purchase.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ erro: 'Compra não encontrada' });
        }

        // Restaurar a quantidade de ingressos disponíveis
        const ticket = await Ticket.findById(compra.ticket);
        if (ticket) {
            ticket.quantidade += compra.quantidade;
            await ticket.save();
        }

        await compra.deleteOne();
        res.json({ mensagem: 'Compra cancelada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao cancelar compra', detalhes: err.message });
    }
});

// Rota para exibir o histórico de compras (interface web)
router.get('/historico', async (req, res) => {
    try {
        // Buscar todas as compras do usuário logado
        const compras = await Purchase.find({ usuario: req.userId }).populate('ticket');

        // Renderizar o template Mustache com os dados das compras
        res.render('historicoCompras', { compras });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar histórico de compras', detalhes: err.message });
    }
});

module.exports = router;