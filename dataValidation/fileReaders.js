const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

// const validateImages = require('./validateImages.js');
const validateReviews = require('./validateReviews.js');

async function processLineByLine(readFrom, validator, writeTo) {
  try {
    const rl = readline.createInterface({
      input: readFrom,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      validator(line, (data) => {
        writeTo.write(`${data} \n`);
      });
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
}

const reviewsFileStream = fs.createReadStream('/Users/jacobwpeterson/Downloads/reviews.csv');
const reviewsWriteStream = fs.createWriteStream('/Users/jacobwpeterson/Downloads/reviews_cleaned.csv', { flags: 'a' });
processLineByLine(reviewsFileStream, validateReviews, reviewsWriteStream);
