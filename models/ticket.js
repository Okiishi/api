const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true, min: 0 },
  quantidadeDisponivel: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Ticket', ticketSchema);
