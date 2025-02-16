const Ingresso = require('../models/Ingresso');

// Criar um novo tipo de ingresso
exports.createTicket = async (req, res) => {
    try {
        const ingresso = await Ingresso.create(req.body);
        res.status(201).json(ingresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar ingresso' });
    }
};

// Listar todos os ingressos
exports.getTickets = async (req, res) => {
    try {
        const ingressos = await Ingresso.find();
        res.status(200).json(ingressos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingressos' });
    }
};
