const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
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
    const product = await Product.findOne({ id: parseInt(req.params.id) });
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
    const { name, price, category, description, discountPrice, stock, image } = req.body;
    
    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields (name, price, description)' });
    }

    const highestProduct = await Product.findOne().sort('-id');
    const newId = highestProduct ? highestProduct.id + 1 : 1;

    const newProduct = await Product.create({
      id: newId,
      name,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      category,
      description,
      stock: stock !== undefined ? parseInt(stock) : 10,
      image: image || 'https://via.placeholder.com/600x400'
    });

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
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      { $set: updates },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
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
    const deletedProduct = await Product.findOneAndDelete({ id: productId });
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
