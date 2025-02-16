const Usuario = require('../models/Usuario');
exports.register = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    await Usuario.create({ username, password, isAdmin });
    res.send('Usuário registrado!');
};

exports.login = (req, res) => {
    res.send('Usuário autenticado!');
};