const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize( 'udemy', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

const Review = sequelize.define('Review', {
  courseId: {
    type: DataTypes.INTEGER
  },
  reviewerId: {
    type: DataTypes.INTEGER
  },
  rating: {
    type: DataTypes.INTEGER
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
    type: DataTypes.INTEGER
  },
  totalRatings: {
    type: DataTypes.INTEGER
  },
  totalStars: {
    type: DataTypes.INTEGER
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
    name: 'reviewerId'
  }
});

sequelize.sync({force: true})
  .then(() => {
    console.log('synced DBS successfully');
  })
  .catch((err) => {
    console.log('ERR: ', err);
  });

module.exports.createOneReview = (review) => {
  return Review.create(review);
};

module.exports.createOneReviewer = (reviewer) => {
  return Reviewer.create(reviewer);
};

module.exports.getOneReview = (id) => {
  return Review.findOne({
    where: {id},
    include: Reviewer
  });
};