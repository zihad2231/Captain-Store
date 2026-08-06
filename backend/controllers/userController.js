const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(usersPath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await readUsers();
    // Return users without passwords
    const usersWithoutPasswords = users.map(u => {
      const { password, ...rest } = u;
      return rest;
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
