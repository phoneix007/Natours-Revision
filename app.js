const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');

const app = express();

/* put post req data on body of request */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/tours', tourRouter);

module.exports = app;
