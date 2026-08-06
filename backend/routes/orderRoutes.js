const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/myorders/:userId', getMyOrders);

module.exports = router;
