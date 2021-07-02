const puppeteer = require('puppeteer');
const fs = require('fs');

const getImages = async (total) => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  const getImage = (id) => {
    return new Promise(async (resolve, reject) => {
      const source = await page.goto('https://thispersondoesnotexist.com/image');

      fs.writeFile(`${__dirname}/images/profile_${id}.jpg`, await source.buffer(), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`IMAGE ${id} saved!`);
        }
      });
    });
  };

  for (let i = 1; i <= total; i++) {
    const response = await getImage(i);
    console.log(response);
  }
};

getImages(1000);

