require('dotenv').config();
require('express-async-errors');
const authMiddleware = require('./middleware/authentication');
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//db
const connectDB = require('./db/connect');

//routers
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');

app.use(express.json());
// extra packages
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', authMiddleware, jobs);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
