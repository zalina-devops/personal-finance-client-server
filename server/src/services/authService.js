const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userModel = require('../models/userModel');

const registerUser = async (email, password) => {
  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    throw ApiError.badRequest('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userModel.createUser(email, hashedPassword);
};

const loginUser = async (email, password) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token };
};

module.exports = {
  registerUser,
  loginUser,
};