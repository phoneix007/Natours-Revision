const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./Models/tourModel');

dotenv.config({ path: './config.env' });

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

const DB = process.env.DATABASE;
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

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully 👍');
  } catch (err) {
    console.log('Error in importing Data 💥');
  }
  process.exit();
};

// console.log(process.argv);

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log('error in  deleting successfully');
  }
  process.exit()
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
