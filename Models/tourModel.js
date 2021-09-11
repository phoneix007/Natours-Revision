const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [40, 'Less then 40 char in name'],
      maxlength: [10, 'more than 10 char are allowed in name'],
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'rating should be more than 1'],
      max: [5, 'rating should be equal or below 5'],
    },
    maxGroupSize: {
      type: Number,
      default: 5,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // NOT GOING TO WORK ON UPDATE
        // THIS POINT TO CURRENT DOCUMENT WHICH IS ABOUT TO SAVE
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount should be less than {{VALUE}}`,
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imagecover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// document middleware
// only for create() and save() method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
