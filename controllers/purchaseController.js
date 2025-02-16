const Compra = require('../models/Compra');

exports.purchaseTickets = async (req, res) => {
    const { ingressos } = req.body;
    await Compra.create({ usuario: req.user.username, ingressos });
    res.send('Compra realizada com sucesso!');
};
