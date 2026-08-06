const fs = require('fs');
const path = require('path');

// Path to the JSON data file
const dataPath = path.join(__dirname, '../data/products.json');

// Helper function to read data
const readData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

// Helper function to write data
const writeData = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await readData();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading products data' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const products = await readData();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading products data' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, price, description, discountPrice, isAvailable, image } = req.body;
    
    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Please provide all required fields (name, price, description)' });
    }

    const products = await readData();
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      description,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image: image || 'https://via.placeholder.com/600x400'
    };

    products.push(newProduct);
    await writeData(products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;
    
    const products = await readData();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...updates, id: productId };
    await writeData(products);

    res.json(products[productIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = await readData();
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await writeData(filteredProducts);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
