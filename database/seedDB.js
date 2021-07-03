const faker = require('faker');
const db = require('./psqlDB.js');

const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const sumOfInput = (input) => {
  return input.reduce((acc, current) => acc + current);
};

const generateOneRating = (id) => {
  const rating = {
    courseId: id,
    '5': randomIntBetween(10, 50),
    '4 1/2': randomIntBetween(10, 50),
    '4': randomIntBetween(1, 30),
    '3 1/2': randomIntBetween(1, 10),
    '3': randomIntBetween(1, 10),
    '2 1/2': randomIntBetween(0, 5),
    '2': randomIntBetween(0, 5),
    '1 1/2': randomIntBetween(0, 5),
    '1': randomIntBetween(0, 5)
  };
  rating.totalRatings = sumOfInput([rating['5'], rating['4 1/2'], rating['4'], rating['3 1/2'], rating['3'], rating['2 1/2'], rating['2'], rating['1 1/2'], rating['1']]);
  rating.totalStars = sumOfInput([rating['5'] * 5, rating['4 1/2'] * 4.5, rating['4'] * 4, rating['3 1/2'] * 3.5, rating['3'] * 3, rating['2 1/2'] * 2.5, rating['2'] * 2, rating['1 1/2'] * 1.5, rating['1']]);
  rating.overallRating = Math.round(((rating.totalStars / rating.totalRatings) * 10) / 10);

  return rating;
};

const generateAndInsertRatings = async (ammount) => {
  for (let i = 1; i <= ammount; i++) {
    try {
      await db.createOneRating(generateOneRating(i));
    } catch (err) {
      console.log('ERROR: ', err);
      break;
    }
    console.log(`successfully added review ${i}`);
  }
};

generateAndInsertRatings(10000000);

