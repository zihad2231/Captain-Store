const mongoose = require('mongoose');
const Product = require('./models/Product');

const moreProducts = [
  {
    name: "Midnight Onyx Smartwatch",
    price: 4999,
    discountPrice: 3999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Premium smartwatch with an AMOLED display, 14-day battery life, and complete health tracking. Encased in midnight onyx.",
    rating: 4.8,
    stock: 25,
    isAvailable: true
  },
  {
    name: "Aero Glide Wireless Headphones",
    price: 8500,
    discountPrice: 7200,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Experience true audio freedom with active noise cancellation, spatial audio, and an ultra-lightweight design.",
    rating: 4.9,
    stock: 12,
    isAvailable: true
  },
  {
    name: "Lumina Minimalist Desk Lamp",
    price: 2400,
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A sleek, touch-controlled desk lamp with adjustable color temperature and a wireless charging base for your devices.",
    rating: 4.5,
    stock: 8,
    isAvailable: true
  }
];

mongoose.connect('mongodb://localhost:27017/captain-store')
  .then(async () => {
    console.log('Connected to MongoDB. Adding new products...');
    
    // get highest id
    const highestProduct = await Product.findOne().sort('-id');
    let startId = highestProduct ? highestProduct.id + 1 : 1;

    for (let p of moreProducts) {
      p.id = startId++;
      await Product.create(p);
      console.log(`Added: ${p.name}`);
    }

    console.log('Successfully added products.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
