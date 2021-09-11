const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.message);
  process.exit(1);
});
const app = require('./app');

const DB = `${process.env.DATABASE}`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Db connection successful 😇');
  })
  .catch((err) => {
    console.log('connection failed 🧐');
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server listen to port 3000');
});
