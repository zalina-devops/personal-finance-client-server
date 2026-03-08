const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await authService.registerUser(email, password);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const data = await authService.loginUser(email, password);

    res.json({
      message: 'Login successful',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};