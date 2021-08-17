//require('newrelic');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize( 'udemy', 'cmedlin', '1x2x@ec2', {
  host: '127.0.0.1',
  port: 5433,
  dialect: 'postgres',
  logging: false
});

// const sequelize = new Sequelize( 'udemy', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'postgres',
//   logging: false
// });

const Review = sequelize.define('Review', {
  courseId: {
    type: DataTypes.INTEGER
  },
  reviewerId: {
    type: DataTypes.INTEGER
  },
  rating: {
    type: DataTypes.FLOAT(11)
  },
  comment: {
    type: DataTypes.STRING(1000)
  },
  helpful: {
    type: DataTypes.INTEGER
  },
  reported: {
    type: DataTypes.BOOLEAN
  }
});

const Reviewer = sequelize.define('Reviewer', {
  name: {
    type: DataTypes.STRING(255)
  },
  picture: {
    type: DataTypes.STRING(255)
  },
  coursesTaken: {
    type: DataTypes.INTEGER
  },
  reviews: {
    type: DataTypes.INTEGER
  }
});

const Rating = sequelize.define('Rating', {
  courseId: {
    type: DataTypes.INTEGER
  },
  overallRating: { //average
    type: DataTypes.FLOAT(11)
  },
  totalRatings: {
    type: DataTypes.INTEGER
  },
  totalStars: {
    type: DataTypes.FLOAT(11)
  },
  '5': {
    type: DataTypes.INTEGER
  },
  '4 1/2': {
    type: DataTypes.INTEGER
  },
  '4': {
    type: DataTypes.INTEGER
  },
  '3 1/2': {
    type: DataTypes.INTEGER
  },
  '3': {
    type: DataTypes.INTEGER
  },
  '2 1/2': {
    type: DataTypes.INTEGER
  },
  '2': {
    type: DataTypes.INTEGER
  },
  '1 1/2': {
    type: DataTypes.INTEGER
  },
  '1': {
    type: DataTypes.INTEGER
  }
});


Review.belongsTo(Reviewer, {
  foreignKey: {
    as: 'reviewer',
    name: 'reviewerId'
  }
});

sequelize.sync()
  .then((result) => {
    console.log('synced successfully!');
  })
  .catch((err) => {
    console.log('synching error: ', err);
  });

module.exports.createOneReview = (review) => {
  return Review.create(review);
};

module.exports.bulkAddReviews = (reviews) => {
  return Review.bulkCreate(reviews);
};

module.exports.getOneReview = (id) => {
  return Review.findOne({
    where: {id},
    include: Reviewer
  });
};

module.exports.getReviewsForOneCourse = (courseId) => {
  return Review.findAll({
    where: {courseId},
    include: Reviewer
  });
  // return new Promise((resolve, reject) => {
  //   Review.findAll({where: {courseId}})
  //     .then((reviews) => {
  //       reviews.forEach((review, index) => {
  //         Reviewer.findOne({where: {id: review.reviewerId}});
  //         review.Reviewer = reviewer;
  //         if (index === reviews.length - 1) {
  //           resolve(reviews);
  //         }
  //       });
  //     })
  //     .catch(err => {
  //       reject(err);
  //     });
  // });
};

module.exports.getRatingForOneCourse = (courseId) => {
  return Rating.findAll({
    where: {id: courseId}
  });
};

module.exports.createOneReviewer = (reviewer) => {
  return Reviewer.create(reviewer);
};

module.exports.createOneRating = (rating) => {
  return Rating.create(rating);
};