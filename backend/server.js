const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/captainstore')
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Seed admin user if it doesn't exist
  const User = require('./models/User');
  const adminUser = await User.findOne({ email: 'zihad' });
  if (!adminUser) {
    const highestUser = await User.findOne().sort('-id');
    const newId = highestUser ? highestUser.id + 1 : 1;
    await User.create({
      id: newId,
      name: 'Zihad Hasan',
      email: 'zihad',
      password: '123456',
      role: 'admin'
    });
    console.log('Seeded admin user zihad');
  }

  // Seed existing products from JSON if the DB is empty
  const Product = require('./models/Product');
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const fs = require('fs');
    const path = require('path');
    const productsPath = path.join(__dirname, 'data/products.json');
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      if (productsData.length > 0) {
        await Product.insertMany(productsData);
        console.log(`Seeded ${productsData.length} products from JSON file to MongoDB`);
      }
    }
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Welcome to the Captain Store API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
