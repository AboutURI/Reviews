const express = require('express');
const path = require('path');
const cors = require('cors');
const shrinkRay = require('shrink-ray-current');
const mongoDb = require('../database/mongoDb.js');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 2712;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(shrinkRay());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// get reviews and ratings for all courses
app.get('/reviews', (req, res) => {
  let reviews;
  let ratings;
  mongoDb.getAllReviews()
    .then((allReviews) => {
      reviews = allReviews;
      mongoDb.getAllRatings()
        .then((allRatings) => {
          ratings = allRatings;
          res.status(200).json({allReviews: reviews, allRatings: ratings});
        });
    });
});

// get reviews and ratings for one course
app.get('/reviews/item', (req, res) => {
  let courseId = Number(req.query.courseId);
  let reviews;
  let rating;
  if (Number.isInteger(courseId) && courseId >= 1 && courseId <= 100) {
    mongoDb.getReviewsForOneCourse(courseId)
      .then((results) => {
        reviews = results;
        mongoDb.getRatingForOneCourse(courseId)
          .then((result) => {
            rating = result;
            let data = {
              courseId: courseId,
              ratings: rating,
              reviews: reviews
            };
            res.status(200).json(data);
          });
      });
  } else {
    res.json('No course selected');
  }
});

// get single rating
app.get('/reviews/:id', (req, res) => {
  const id = req.params.id;
  mongoDb.getOneReview(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
});