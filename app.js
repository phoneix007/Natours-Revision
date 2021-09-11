const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./AppError');

const app = express();

/* put post req data on body of request */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use('/tours', tourRouter);
app.use('/user', userRouter);

// app.all is use for all http verb req , like get, post...
app.all('*', (req, res, next) => {
  const err = new AppError(`This route ${req.originalUrl} not defined`, 404);
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
