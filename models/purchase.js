const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    quantidade: { type: Number, required: true },
    data: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
