import http from 'k6/http';

export let options = {
  scenarios: {
    ten_per_second: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 10,
      maxVUs: 20,
    },
    one_hundred_per_second: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '3m',
      startTime: '30s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
    five_hundred_per_second: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '3m',
      startTime: '210s',
      preAllocatedVUs: 100,
      maxVUs: 400,
    },
    one_thousand_per_second: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '3m',
      startTime: '390s',
      preAllocatedVUs: 100,
      maxVUs: 400,
    },
  },
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function () {
  const id = randomIntFromInterval(9000000, 10000000);
  http.get(`http://localhost:2712/course/${id}/reviews`);
}