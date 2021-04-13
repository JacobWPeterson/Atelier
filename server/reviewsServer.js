/* eslint-disable camelcase */
require('newrelic');
const express = require('express');
const db = require('../db/connection.js');

const app = express();

const port = 3000;

const memcache = {};

app.use(express.json());

app.get('/loaderio-d61874a70c31416f34c217a26d3603b4', (req, res) => {
  res.send('loaderio-d61874a70c31416f34c217a26d3603b4');
});

// Get all product reviews
app.get('/reviews', (req, res) => {
  const { product_id } = req.query;
  const { page } = req.query;
  const { count } = req.query;
  const { sort } = req.query;

  const productReviews = {
    product: product_id,
    page,
    count,
    reviews: [],
  };

  const memModel = {
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    recommended: {
      0: 0,
      1: 0,
    },
  };
  db.connect((err, client, release) => {
    if (err) {
      res.status(404).send(err.stack);
    }
    // Execute db read/find based on product_id
    client.query(`SELECT * FROM reviews WHERE product_id = ${product_id} AND reported = false`, (err, response) => {
      release();
      if (err) {
        res.status(404).send(err.stack);
      } else {
        productReviews.reviews.push(response.rows);
        response.rows.forEach((row) => {
          memModel.ratings[row.rating] += 1;
          if (row.recommend === false) {
            memModel.recommended[0] += 1;
          } else {
            memModel.recommended[1] += 1;
          }
        });
        memcache[product_id] = memModel;
        res.status(200).send(productReviews);
      }
    });
  });
  delete memcache[product_id];
});

// Get product review metadata
app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;

  const reviewMetadata = {
    product_id,
    ratings: memcache[product_id].ratings,
    recommended: memcache[product_id].recommended,
    characteristics: {},
  };
  db.connect((err, client, release) => {
    if (err) {
      res.status(404).send('Error acquiring client', err.stack);
    }
    // Execute db read/find based on product_id
    client.query(`SELECT * FROM characteristics WHERE product_id = ${product_id}`, (err, response) => {
      if (err) {
        res.status(404).send(err.stack);
      } else {
        const characteristics = [];
        const characteristicIds = [];
        response.rows.forEach((row) => {
          characteristics.push(row.name);
          characteristicIds.push(row.id);
        });

        const query = `SELECT characteristic_id, AVG(value)::NUMERIC(10,4) AS total FROM characteristic_reviews WHERE characteristic_id = ANY(Array[${characteristicIds}]) GROUP BY characteristic_id ORDER BY characteristic_id`;
        client.query(query, (error, resp) => {
          release();
          if (error) {
            res.status(404).send(error.stack);
          } else {
            let index = 0;
            resp.rows.forEach((row) => {
              reviewMetadata.characteristics[characteristics[index]] = {
                id: row.characteristic_id,
                value: row.total,
              };
              index += 1;
            });
            res.status(200).send(reviewMetadata);
          }
        });
      }
    });
  });
  delete memcache[product_id];
});

// Post new reviews to the database
app.post('/reviews', (req, res) => {
  const { product_id } = req.body.params;
  const { rating } = req.body.params;
  const { summary } = req.body.params;
  const { body } = req.body.params;
  const { recommend } = req.body.params;
  const { name } = req.body.params;
  const { email } = req.body.params;
  const { photos } = req.body.params;
  const { characteristics } = req.body.params;

  // Execute db create for review
  const query = `INSERT INTO reviews (product_id, rating, date,summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, CURRENT_DATE, ${summary}, ${body}, ${recommend}, f, ${name}, ${email}, null, 0)`;

  db.query(query, (error, response) => {
    if (error) {
      res.status(404).send(error.stack);
    } else {
      res.sendStatus(201);
    }
  });
  // Execute db update for characteristics
});

// Mark a review as helpful or report it
app.put('/reviews/:q/:b', (req, res) => {
  const review_id = req.params.q;
  const fieldToUpdate = req.params.b;

  // Execute db update based on 'fieldToUpdate' variable for the given review_Id
  if (fieldToUpdate === 'report') {
    db.query(`UPDATE reviews SET reported = true WHERE id = ${review_id}`, (err) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    db.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`, (err) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.sendStatus(204);
      }
    });
  }
});

app.listen(port);
