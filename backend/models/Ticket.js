const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number },
  customerName: { type: String, default: 'Guest' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Open' },
  priority: { type: String, default: 'Medium' },
  adminReply: { type: String, default: '' },
  date: { type: String }
});

module.exports = mongoose.model('Ticket', ticketSchema);
