const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const highestUser = await User.findOne().sort('-id');
    const newId = highestUser ? highestUser.id + 1 : 1;

    const newUser = await User.create({
      id: newId,
      name,
      email,
      password, // In a real app, hash this! (e.g. bcrypt)
      role: 'customer' // Default role
    });

    // Return user without password
    const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check user and password
    const user = await User.findOne({ email, password });
    
    if (user) {
      const userWithoutPassword = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
