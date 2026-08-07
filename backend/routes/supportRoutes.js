const express = require('express');
const router = express.Router();
const { getAllTickets, getUserTickets, createTicket, replyTicket } = require('../controllers/supportController');

router.get('/', getAllTickets);
router.get('/user/:userId', getUserTickets);
router.post('/', createTicket);
router.put('/:id/reply', replyTicket);

module.exports = router;
