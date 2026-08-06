const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    const orders = await Order.find({});
    const productsCount = await Product.countDocuments({});
    
    // Calculate total sales from all orders
    const totalSales = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    
    // Low stock items
    const lowStockItems = await Product.countDocuments({ stock: { $lte: 5 } });

    res.json({
      totalUsers: usersCount,
      totalSales,
      pendingOrders,
      totalProducts: productsCount,
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
