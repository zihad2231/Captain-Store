const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number },
  products: [{
    id: { type: Number },
    quantity: { type: Number },
    price: { type: Number }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);
