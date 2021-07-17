const db = require('./couchbaseDB.js');
const faker = require('faker');

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

const generateAndInsertRatings = (amount) => {
  return new Promise(async (resolve, reject) => {
    let data = [];
    for (let i = 1; i <= amount; i++) {
      data.push(generateOneRating(i));
      if (i % 10000 === 0) {
        try {
          await db.bulkAddRatings(data);
          data = [];
          console.log(`ratings inserted to id ${i}`);
        } catch (err) {
          console.log('ERROR: ', err);
          break;
          reject(err);
        }
      }
      if (i === amount) {
        resolve('successfully seeded Ratings!');
      }
    }
  });
};

const generateUserImage = () => {
  const colors = [
    'rgb(77, 171, 101)',
    'rgb(156, 70, 127)',
    'rgb(240, 189, 79)',
    'rgb(115, 114, 108)',
    'rgb(40, 150, 169)'
  ];
  //decide between image or no image
  const flipCoin = randomIntBetween(0, 1);
  if (flipCoin > 0) {
    return `https://rpt27-sdc-udemy.s3.us-west-1.amazonaws.com/profile_${randomIntBetween(1, 1000)}.jpg`;
  }
  return colors[randomIntBetween(0, colors.length - 1)];
};

const generateOneReviewer = () => {
  return {
    name: faker.name.findName(),
    picture: generateUserImage(),
    coursesTaken: randomIntBetween(1, 25),
    reviews: randomIntBetween(1, 25)
  };
};

const generateStarRating = () => {
  const highRating = [5, 4.5, 4];
  const lowRating = [3.5, 3, 2.5, 2, 1.5, 1];
  //bias to high ratings
  const coinFlip = randomIntBetween(0, 3);
  if (coinFlip > 0) {
    return highRating[randomIntBetween(0, highRating.length - 1)];
  }
  return lowRating[randomIntBetween(0, lowRating.length - 1)];
};

const generateRandomDate = (date1, date2) => {
  return new Date(date1.getTime() + Math.random() * (date2.getTime() - date1.getTime()));
};

const generateOneReview = (courseId) => {
  // random date since 1/1/2018
  const startDate = new Date('01 January 2018 00:00 UTC');
  const currentDate = new Date();
  const randomDate = generateRandomDate(startDate, currentDate).toISOString();

  return {
    courseId,
    Reviewer: generateOneReviewer(),
    rating: generateStarRating(),
    comment: faker.lorem.words(100).substr(0, randomIntBetween(150, 850)),
    createdAt: randomDate,
    helpful: randomIntBetween(0, 50),
    reported: false,
  };
};

let reviewStore = [];

const performInsert = () => {
  return new Promise((resolve, reject) => {
    db.bulkAddReviews(reviewStore)
      .then((result) => {
        reviewStore = [];
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

let attempts = 0;

const backoff = (attempt, func) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      func()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }, attempt * 2000);
  });
};

const generateAndInsertReviews = (start, amountOfCourses) => {
  return new Promise(async (resolve, reject) => {
    for (let i = start; i <= amountOfCourses; i++) {
      const amountOfReviews = randomIntBetween(5, 15);
      for (let j = 1; j <= amountOfReviews; j++) {
        reviewStore.push(generateOneReview(i));
      }
      if (i % 500 === 0) {
        try {
          await performInsert();
          console.log(`successfully created reviews for course ${i}`);
        } catch (err) {
          console.log('ERROR -- backing off');
          let attempts = 1;
          while (attempts < 5) {
            try {
              await backoff(attempts, performInsert);
              break;
            } catch (err) {
              console.log(`backoff attempt ${attempts}`);
              attempts++;
            }
          }
        }
      }
      if (i === amountOfCourses) {
        resolve('successfully seeded reviews!');
      }
    }
  });
};

// generateAndInsertRatings(10000000)
//   .then((res) => {
//     console.log(res);
//     return generateAndInsertReviews(10000000);
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log('oh no, there was an error, you suck!: ', err);
//   });

generateAndInsertReviews(2207500, 10000000);