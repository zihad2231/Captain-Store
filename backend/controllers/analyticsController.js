const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const ordersPath = path.join(__dirname, '../data/orders.json');
const productsPath = path.join(__dirname, '../data/products.json');

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) resolve([]);
      else {
        try { resolve(JSON.parse(data)); } 
        catch (e) { resolve([]); }
      }
    });
  });
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const users = await readFile(usersPath);
    const orders = await readFile(ordersPath);
    const products = await readFile(productsPath);

    const totalUsers = users.length;
    
    // Calculate total sales from all orders
    const totalSales = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    
    // Assuming products have a countInStock field, or just count total products
    const totalProducts = products.length;
    
    // Low stock items (assuming threshold of 5 if countInStock exists)
    const lowStockItems = products.filter(p => p.countInStock !== undefined && p.countInStock <= 5).length;

    res.json({
      totalUsers,
      totalSales,
      pendingOrders,
      totalProducts,
      lowStockItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  getAnalytics
};
