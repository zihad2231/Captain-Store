const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (in a real app, this should be Protected)
const createOrder = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const highestOrder = await Order.findOne().sort('-id');
    const newId = highestOrder ? highestOrder.id + 1 : 1;

    // Map orderItems to products array if needed, or just save as is if schema allows
    const newOrder = await Order.create({
      id: newId,
      user_id: userId,
      products: orderItems, // assuming frontend structure matches loosely or can be stored in mixed/array
      total: totalPrice,
      status: 'Pending',
      date: new Date().toISOString()
    });

    // To maintain compatibility with frontend, return mapped object
    res.status(201).json({
      id: newOrder.id,
      userId: newOrder.user_id,
      orderItems: newOrder.products,
      totalPrice: newOrder.total,
      status: newOrder.status,
      createdAt: newOrder.date
    });
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
    const orders = await Order.find({ user_id: userId });
    
    // Map to frontend expected format
    const formattedOrders = orders.map(o => ({
      id: o.id,
      userId: o.user_id,
      orderItems: o.products,
      totalPrice: o.total,
      status: o.status,
      createdAt: o.date
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    // Map to frontend expected format
    const formattedOrders = orders.map(o => ({
      id: o.id,
      userId: o.user_id,
      orderItems: o.products,
      totalPrice: o.total,
      status: o.status,
      createdAt: o.date
    }));
    res.json(formattedOrders);
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
    
    const updatedOrder = await Order.findOneAndUpdate(
      { id: orderId },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      id: updatedOrder.id,
      userId: updatedOrder.user_id,
      orderItems: updatedOrder.products,
      totalPrice: updatedOrder.total,
      status: updatedOrder.status,
      createdAt: updatedOrder.date
    });
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
