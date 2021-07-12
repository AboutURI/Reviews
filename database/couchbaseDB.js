const couchbase = require('couchbase');

const cluster = new couchbase.Cluster('couchbase://localhost', {
  username: 'root',
  password: 'admin1'
});

const ratingsBucket = cluster.bucket('Ratings');
const Ratings = ratingsBucket.defaultCollection();

const reviewsBucket = cluster.bucket('Reviews');
const Reviews = reviewsBucket.defaultCollection();

const upsertDocument = async (doc) => {
  const key = 'Rating_1';
  try {
    const result = await collection.upsert(key, doc);
    console.log(result);
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

//used for generating a UID
const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//used for generating a UID
const generateToken = (length) => {
  const alphaNum = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let token = '';
  while (token.length < length) {
    token += alphaNum[randomIntBetween(0, alphaNum.length - 1)];
  }
  return token;
};

//couchbase will not automatically generate a UID
const generateUid = () => {
  //use time to ensure uniqueness
  const incrementedPortion = Date.now() - 1234567;
  const pre = generateToken(randomIntBetween(5, 10));
  const post = generateToken(randomIntBetween(5, 10));
  return `${pre}${incrementedPortion}${post}`;
};


module.exports.createOneReview = (review) => {
  return Reviews.upsert(generateUid(), review);
};

module.exports.bulkAddReviews = (reviews) => {
  const dbQueries = [];
  reviews.forEach(review => {
    dbQueries.push(Reviews.upsert(generateUid(), review));
  });
  return Promise.all(dbQueries);
};

module.exports.getOneReview = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Reviews.get(id);
      resolve(response.value);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.getReviewsForOneCourse = (courseId) => {

};

module.exports.getRatingForOneCourse = (courseId) => {

};


module.exports.createOneRating = (rating) => {
  return Ratings.upsert(generateUid(), rating);
};

module.exports.bulkAddRatings = (ratings) => {
  const dbQueries = [];
  ratings.forEach(rating => {
    dbQueries.push(Ratings.upsert(generateUid(), rating));
  });
  return Promise.all(dbQueries);
};