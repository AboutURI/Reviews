const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect('mongodb://localhost/review-service', { useNewUrlParser: true, useUnifiedTopology: true });

const mongoDb = mongoose.connection;
mongoDb.on('error', console.error.bind(console, 'connection error:'));
mongoDb.once('open', () => {
  console.log('Connected to MongoDB');
});

const reviewSchema = new mongoose.Schema({ // 1 -> many: course_id -> reviews
  reviewId: Number,
  courseId: Number,
  reviewer: Object, // {“reviewerId”: Number, “name”: String, “picture”: String, “coursesTaken”: Number, “reviews”: Number}
  rating: Number,
  comment: String,
  createdAt: Date,
  helpful: Number,
  reported: Boolean
}, { versionKey: false });

reviewSchema.plugin(autoIncrement, {inc_field: 'reviewId'});

const ratingSchema = new mongoose.Schema({ // 1 <-> 1: course_id <-> rating
  courseId: Number,
  overallRating: Number, // average rating
  totalRatings: Number, // amount of ratings
  totalStars: Number,
  '5': Number,
  '4 1/2': Number,
  '4': Number,
  '3 1/2': Number,
  '3': Number,
  '2 1/2': Number,
  '2': Number,
  '1 1/2': Number,
  '1': Number
}, { versionKey: false });

let Review = mongoose.model('Review', reviewSchema);
let Rating = mongoose.model('Rating', ratingSchema);

const getAllReviews = () => {
  return Review.find().exec();
};

const getReviewsForOneCourse = (id) => {
  return Review.find({courseId: id}).exec();
};

const getOneReview = (id) => {
  return Review.find({reviewId: id}).exec();
};

const createOneReview = (review) => {
  return Review.create(review);
};

const deleteOneReview = (id) => {
  return Review.findOneAndRemove({reviewId: id});
};

const updateOneReview = (id, newData) => {
  return Review.findOneAndUpdate({reviewId: id}, newData, {upsert: false});
};

const getAllRatings = () => {
  return Rating.find().exec();
};

const getRatingForOneCourse = (id) => {
  return Rating.findOne({courseId: id}).exec();
};

const addReview = (review) => {
  let document = new Review({
    courseId: review.courseId,
    reviewer: {
      reviewerId: review.reviewer.reviewerId,
      name: review.reviewer.name,
      picture: review.reviewer.picture,
      coursesTaken: review.reviewer.coursesTaken,
      reviews: review.reviewer.reviews
    },
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    helpful: review.helpful,
    reported: false
  });

  return document.save();
};

const updateRating = (review, rating) => {
  let filter = {courseId: review.courseId};
  let newTotalStars = rating.totalStars + review.rating;
  let newTotalRatings = rating.totalRatings + 1;
  let currentRating = review.rating.toString();
  let newOverallRating = newTotalStars / newTotalRatings;

  let valuesToSet = { overallRating: newOverallRating, totalRatings: newTotalRatings, totalStars: newTotalStars };

  if (review.rating === 5) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: { '5': 1} }).exec();
  } else if (review.rating === 4.5) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'4 1/2': 1} }).exec();
  } else if (review.rating === 4) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'4': 1} }).exec();
  } else if (review.rating === 3.5) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'3 1/2': 1} }).exec();
  } else if (review.rating === 3) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'3': 1} }).exec();
  } else if (review.rating === 2.5) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'2 1/2': 1} }).exec();
  } else if (review.rating === 2) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'2': 1} }).exec();
  } else if (review.rating === 1.5) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'1 1/2': 1} }).exec();
  } else if (review.rating === 1) {
    return Rating.updateOne(filter, { $set: valuesToSet, $inc: {'1': 1} }).exec();
  }
};

const addReviewAndUpdateRating = (review) => {
  return new Promise ((resolve, reject) => {
    addReview(review)
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        getRatingForOneCourse(result.courseId)
          .catch((err) => {
            console.log(err);
          })
          .then((rating) => {
            updateRating(review, rating)
              .catch((err) => {
                reject(err);
              })
              .then((result) => {
                resolve(result);
              });
          });
      });
  });
};


const resetRating = (rating) => {
  return Rating.updateOne({courseId: rating.courseId},
    {
      courseId: rating.courseId,
      overallRating: 0,
      totalRatings: 0,
      totalStars: 0,
      '5': 0,
      '4 1/2': 0,
      '4': 0,
      '3 1/2': 0,
      '3': 0,
      '2 1/2': 0,
      '2': 0,
      '1 1/2': 0,
      '1': 0,
    }, {upsert: true}).exec();
};

module.exports = {
  Review, // used in dataGenerators.js
  Rating, // used in dataGenerators.js
  getAllReviews, // used in server/index.js and s3.js
  getReviewsForOneCourse, // used in server/index.js
  getAllRatings, // used in server/index.js and s3.js
  getRatingForOneCourse, // used in server/index.js
  addReviewAndUpdateRating, // used in dataGenerators.js
  resetRating, // used in dataGenerators.js
  getOneReview,
  createOneReview,
  deleteOneReview,
  updateOneReview
};