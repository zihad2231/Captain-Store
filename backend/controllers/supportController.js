const fs = require('fs');
const path = require('path');

const supportPath = path.join(__dirname, '../data/support.json');

const readTickets = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(supportPath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') resolve([]);
        else reject(err);
      }
      else {
        try { resolve(JSON.parse(data) || []); } 
        catch (e) { resolve([]); }
      }
    });
  });
};

const writeTickets = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(supportPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// @desc    Get all support tickets
// @route   GET /api/support
const getAllTickets = async (req, res) => {
  try {
    const tickets = await readTickets();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tickets' });
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

    const tickets = await readTickets();
    const newTicket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      userId: userId || null,
      customerName: customerName || 'Guest',
      subject,
      message,
      status: 'Open',
      adminReply: '',
      createdAt: new Date().toISOString()
    };

    tickets.push(newTicket);
    await writeTickets(tickets);

    res.status(201).json(newTicket);
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

    const tickets = await readTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    tickets[ticketIndex].adminReply = adminReply || tickets[ticketIndex].adminReply;
    tickets[ticketIndex].status = status || tickets[ticketIndex].status;

    await writeTickets(tickets);

    res.json(tickets[ticketIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error replying to ticket' });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  replyTicket
};
