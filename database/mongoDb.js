const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/review-service', { useNewUrlParser: true, useUnifiedTopology: true });

const mongoDb = mongoose.connection;
mongoDb.on('error', console.error.bind(console, 'connection error:'));
mongoDb.once('open', () => {
  console.log('Connected to the MongoDB database');
});

const reviewSchema = new mongoose.Schema({ // 1 -> many: course_id -> reviews
  courseId: Number,
  reviewer: Object, // {“reviewerId”: Number, “name”: String, “picture”: String, “coursesTaken”: Number, “reviews”: Number}
  rating: Number,
  comment: String,
  createdAt: Date,
  helpful: Number,
  reported: Boolean
});

const ratingSchema = new mongoose.Schema({ // 1 <-> 1: course_id <-> rating
  courseId: Number,
  overallRating: Number, // average rating
  totalRatings: Number, // amount of ratings
  totalStars: Number, // total of stars
  fiveStars: Number,
  fourStars: Number,
  threeStars: Number,
  twoStars: Number,
  oneStar: Number
});

let Review = mongoose.model('Review', reviewSchema);
let Rating = mongoose.model('Rating', ratingSchema);

module.exports = { Review, Rating };