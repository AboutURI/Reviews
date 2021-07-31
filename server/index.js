require('newrelic');
const express = require('express');
const path = require('path');
const cors = require('cors');
const shrinkRay = require('shrink-ray-current');
const db = require('../database/psqlDB.js');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

const port = process.env.PORT || 2712;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(shrinkRay());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.use(bodyParser.json());

// get reviews and ratings for all courses
app.get('/reviews', (req, res) => {
  let reviews;
  let ratings;
  db.getAllReviews()
    .then((allReviews) => {
      reviews = allReviews;
      db.getAllRatings()
        .then((allRatings) => {
          ratings = allRatings;
          res.status(200).json({allReviews: reviews, allRatings: ratings});
        });
    });
});

// get reviews and ratings for one course
app.get('/course/:id/reviews', (req, res) => {
  let courseId = Number(req.params.id);
  let reviews;
  let rating;
  if (Number.isInteger(courseId) && courseId >= 1 && courseId <= 10000000) {
    db.getReviewsForOneCourse(courseId)
      .then((results) => {
        reviews = results;
        return db.getRatingForOneCourse(courseId);
      })
      .then((result) => {
        rating = result;
        let data = {
          courseId: courseId,
          ratings: rating[0],
          reviews: reviews
        };
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  } else {
    res.json('No course selected');
  }
});



// get single review
app.get('/review/:id', (req, res) => {
  db.getOneReview(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

// create single review
app.post('/review', (req, res) => {
  db.createOneReview(req.body.review)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

//delete single review
app.delete('/review/:id', (req, res) => {
  db.deleteOneReview(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

//update single review
app.put('/review/:id', (req, res) => {
  db.updateOneReview(req.params.id, req.body.review)
    .then((result) => {
      if (result === null) {
        throw new Error(`No Review exists for id ${req.params.id}`);
      }
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

//create single reviewer
app.post('/reviewer', (req, res) => {
  db.createOneReviewer(req.body.reviewer)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//create single rating
app.post('/rating', (req, res) => {
  db.createOneRating(req.body.rating)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
});