const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importe o modelo de usuário

const router = express.Router();

// Segredo para assinar os tokens 
const SECRET_KEY = 'seuSegredoJWT';

// Rota de registro (Cadastro)
router.post("/register", async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Verifica se o email já está cadastrado
        const usuarioExistente = await User.findOne({ email });

        if (usuarioExistente) {
            return res.status(400).json({ erro: "Email já cadastrado" });
        }

        // Cria novo usuário
        const novoUsuario = new User({
            nome,
            email,
            password // Campo de senha
        });

        await novoUsuario.save();

        res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao registrar usuário", detalhes: error.message });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Use "password" em vez de "senha"

        // Verifica se o usuário existe no banco de dados
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Verifica a senha (sem bcrypt)
        if (usuario.password !== password) { // Use "password" em vez de "senha"
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: usuario._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ erro: 'Erro no login', detalhes: err.message });
    }
});

module.exports = router;