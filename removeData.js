require('dotenv').config();
const connectDB = require('./db/connect');
const User = require('./models/User');

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const deleted = await User.deleteMany({});
};

start();
