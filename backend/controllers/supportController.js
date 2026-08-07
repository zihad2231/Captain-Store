const Ticket = require('../models/Ticket');

// @desc    Get all support tickets
// @route   GET /api/support
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    // Map to match old JSON structure for frontend
    const formattedTickets = tickets.map(t => ({
      id: t.id,
      userId: t.user_id,
      customerName: t.customerName || 'Guest',
      subject: t.subject,
      message: t.message || '',
      status: t.status,
      adminReply: t.adminReply,
      createdAt: t.date
    }));
    res.json(formattedTickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

// @desc    Get user's support tickets
// @route   GET /api/support/user/:userId
const getUserTickets = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const tickets = await Ticket.find({ user_id: userId });
    
    // Map to match frontend structure
    const formattedTickets = tickets.map(t => ({
      id: t.id,
      userId: t.user_id,
      customerName: t.customerName || 'Guest',
      subject: t.subject,
      message: t.message || '',
      status: t.status,
      reply: t.adminReply, // Widget expects `reply`
      createdAt: t.date
    }));
    res.json(formattedTickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user tickets' });
  }
};

// @desc    Create a new support ticket
// @route   POST /api/support
const createTicket = async (req, res) => {
  try {
    const { userId, subject, message, customerName } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Please provide subject and message' });
    }

    const highestTicket = await Ticket.findOne().sort('-id');
    const newId = highestTicket ? highestTicket.id + 1 : 1;

    const newTicket = await Ticket.create({
      id: newId,
      user_id: userId || null,
      subject,
      status: 'Open',
      adminReply: '',
      date: new Date().toISOString(),
      message: message,
      customerName: customerName || 'Guest'
    });

    res.status(201).json({
      id: newTicket.id,
      userId: newTicket.user_id,
      customerName: newTicket.customerName || 'Guest',
      subject: newTicket.subject,
      message: newTicket.message,
      status: newTicket.status,
      adminReply: newTicket.adminReply,
      createdAt: newTicket.date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating ticket' });
  }
};

// @desc    Reply/update a support ticket
// @route   PUT /api/support/:id/reply
const replyTicket = async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const { adminReply, status } = req.body;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { id: ticketId },
      { $set: { adminReply: adminReply, status: status } },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      id: updatedTicket.id,
      userId: updatedTicket.user_id,
      customerName: updatedTicket.customerName || 'Guest',
      subject: updatedTicket.subject,
      message: updatedTicket.message,
      status: updatedTicket.status,
      adminReply: updatedTicket.adminReply,
      createdAt: updatedTicket.date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error replying to ticket' });
  }
};

module.exports = {
  getAllTickets,
  getUserTickets,
  createTicket,
  replyTicket
};
