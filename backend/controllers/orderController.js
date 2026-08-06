const fs = require('fs');
const path = require('path');

const ordersPath = path.join(__dirname, '../data/orders.json');

const readOrders = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(ordersPath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const writeOrders = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(ordersPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (in a real app, this should be Protected)
const createOrder = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orders = await readOrders();

    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      userId, // User ID if logged in
      orderItems,
      shippingAddress,
      totalPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await writeOrders(orders);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders/:userId
// @access  Public (in a real app, this should be Protected via token)
const getMyOrders = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const orders = await readOrders();
    const myOrders = orders.filter(o => o.userId === userId);
    res.json(myOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await readOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const orders = await readOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    orders[orderIndex].status = status || orders[orderIndex].status;
    await writeOrders(orders);

    res.json(orders[orderIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
