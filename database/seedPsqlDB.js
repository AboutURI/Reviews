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

<<<<<<< HEAD
const generateAndInsertRatings = async (amount) => {
  for (let i = 1; i <= amount; i++) {
    try {
      await db.createOneRating(generateOneRating(i));
    } catch (err) {
      console.log('ERROR: ', err);
      break;
    }
    console.log(`successfully added review ${i}`);
  }
};

//generateAndInsertRatings(10000000); => complete

=======
const generateAndInsertRatings = (start, amount) => {
  return new Promise( async (resolve, reject) => {
    for (let i = start; i <= amount; i++) {
      try {
        await db.createOneRating(generateOneRating(i));
      } catch (err) {
        console.log('ERROR: ', err);
        reject(err);
        break;
      }
      if (i % 10000 === 0) {
        console.log(`successfully added rating ${i}`);
      }
      if (i === amount) {
        resolve('success');
      }
    }
  });
};

>>>>>>> load

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

<<<<<<< HEAD
const generateAndInsertReviewers = async (amount) => {
  for (let i = 1; i <= amount; i++) {
    try {
      await db.createOneReviewer(generateOneReviewer());
    } catch (err) {
      console.log('ERROR: ', err);
      break;
    }
    console.log(`successfully addded reviewer ${i}`);
  }
};

//generateAndInsertReviewers(1000000); => complete

=======
const generateAndInsertReviewers = (start, amount) => {
  return new Promise( async (resolve, reject) => {
    for (let i = start; i <= amount; i++) {
      try {
        await db.createOneReviewer(generateOneReviewer());
      } catch (err) {
        console.log('ERROR: ', err);
        reject(err);
        break;
      }
      if (amount % 10000 === 0) {
        console.log(`successfully addded reviewer ${i}`);
      }
      if (i === amount) {
        resolve('success');
      }
    }
  });
};

>>>>>>> load
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
<<<<<<< HEAD
    reviewerId: randomIntBetween(1, 1000000),
=======
    //CHANGE FOR NUMBER OF REVIEWERS
    reviewerId: randomIntBetween(1, 100),
>>>>>>> load
    rating: generateStarRating(),
    comment: faker.lorem.words(100).substr(0, randomIntBetween(150, 850)),
    createdAt: randomDate,
    helpful: randomIntBetween(0, 50),
    reported: false
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

<<<<<<< HEAD
const generateAndInsertReviews = async (amountOfCourses) => {
  for (let i = 1; i <= amountOfCourses; i++) {
    const amountOfReviews = randomIntBetween(5, 15);
    for (let j = 1; j <= amountOfReviews; j++) {
      reviewStore.push(generateOneReview(i));
    }
    if (i % 10000 === 0) {
      try {
        await performInsert();
      } catch (err) {
        console.log('ERROR: ', err);
        break;
      }
      console.log(`successfully created reviews for course ${i}`);
    }
  }
};

generateAndInsertReviews(10000000);
=======
const generateAndInsertReviews = (start, amountOfCourses) => {
  return new Promise( async (resolve, reject) => {
    for (let i = start; i <= amountOfCourses; i++) {
      const amountOfReviews = randomIntBetween(5, 15);
      for (let j = 1; j <= amountOfReviews; j++) {
        reviewStore.push(generateOneReview(i));
      }
      if (i % 10 === 0) {
        try {
          await performInsert();
        } catch (err) {
          console.log('ERROR: ', err);
          reject(err);
          break;
        }
        console.log(`successfully created reviews for course ${i}`);
      }
      if (i === amountOfCourses) {
        resolve('success');
      }
    }
  });
};



generateAndInsertRatings(1, 100)
  .then(() => {
    return generateAndInsertReviewers(1, 100);
  })
  .then(() => {
    return generateAndInsertReviews(1, 100);
  })
  .catch(err => {
    console.log('caught error: ', err);
  });

//generateAndInsertReviews(1, 100);
>>>>>>> load
