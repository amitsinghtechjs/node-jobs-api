const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require('../errors');

const login = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email)
    throw new BadRequestError('Username and password is required');
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isCorrectPassword = await user.comparePassword(req.body.password);
  if (!isCorrectPassword) throw new UnauthenticatedError('Invalid credentials');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

module.exports = {
  login,
  register,
};
