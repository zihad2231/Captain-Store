const express = require('express');
const router = express.Router();
const { getAllTickets, createTicket, replyTicket } = require('../controllers/supportController');

router.get('/', getAllTickets);
router.post('/', createTicket);
router.put('/:id/reply', replyTicket);

module.exports = router;
