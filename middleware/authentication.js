const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const authorize = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer '))
    throw new UnauthenticatedError('Ivalid Credentials');
  const token = authorization.split(' ')[1];
  const payload = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.userId);
  if (!user) throw new UnauthenticatedError('Invalid Credentials');

  req.user = { userId: payload.userId, name: payload.name };
  next();
};

module.exports = authorize;
