const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global', unique: true },
  activeTheme: { type: String, default: 'default' },
  bannerText: { type: String, default: '🚀 Special Offer: Free Shipping on all orders over ৳5000!' }
});

module.exports = mongoose.model('Settings', settingsSchema);
