const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
