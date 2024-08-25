require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const authRoute = require('./routes/auth');
const projectRoute = require('./routes/project');
const taskTrackerRoute = require('./routes/task-tracker');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// routes
app.get('/', (req, res) => {
  res.send('Task Tracker api');
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/task-tracker', authenticateUser, taskTrackerRoute);
app.use('/api/v1/project', authenticateUser, projectRoute);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.DB_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
