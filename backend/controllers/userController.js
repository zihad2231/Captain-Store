const User = require('../models/User');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Return users without passwords
    const usersWithoutPasswords = users.map(u => {
      return { id: u.id, name: u.name, email: u.email, role: u.role };
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  getAllUsers
};
