// Importações necessárias
const express = require('express');
const mongoose = require('mongoose');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes');
const ticketsRoute = require('./routes/ticketsRoute');
const purchaseRoutes = require('./routes/purchaseRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const path = require('path');



// Configuração do Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({ secret: 'segredo', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configuração do Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    res.render('login'); // Renderiza o template login.mustache
});

// Helper para multiplicar valores no Mustache
app.locals.multiplicar = function() {
    return function(preco, quantidade, render) {
        const total = parseFloat(preco) * parseInt(quantidade);
        return render(`{{total}}`).replace('{{total}}', total.toFixed(2));
    };
};

// Conexão com banco de dados MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ingressos');
// Rotas
app.use('/users', userRoutes);
app.use('/tickets', ticketsRoute);
app.use('/purchases', authMiddleware, purchaseRoutes);
app.use("/auth", authRoutes);

// Inicialização do servidor
app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
