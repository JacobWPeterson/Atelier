CREATE TABLE reviews(
   id INTEGER NOT NULL PRIMARY KEY,
   product_id INTEGER NOT NULL,
   rating SMALLINT,
   date VARCHAR(10) NOT NULL,
   summary VARCHAR(150) NOT NULL,
   body TEXT NOT NULL,
   recommend BOOLEAN,
   reported BOOLEAN,
   reviewer_name VARCHAR(60) NOT NULL,
   reviewer_email VARCHAR(60) NOT NULL,
   response TEXT,
   helpfulness SMALLINT
);

CREATE INDEX product_reviews_not_reported ON reviews (product_id, reported);

-- CREATE TABLE images(
--   id SERIAL,
--   review_id INTEGER NOT NULL REFERENCES reviews,
--   url TEXT NOT NULL
-- );

-- CREATE INDEX review_id ON images (review_id);

CREATE TABLE characteristics_total(
  id SERIAL,
  product_id INTEGER NOT NULL,
  name VARCHAR(20) NOT NULL,
  total_from_reviews INTEGER,
  total_reviews INTEGER
);

CREATE TABLE characteristics(
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(20) NOT NULL
);

CREATE INDEX product_id ON characteristics (product_id);

CREATE TABLE characteristic_reviews(
  id SERIAL,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics,
  review_id INTEGER NOT NULL REFERENCES reviews,
  value INTEGER NOT NULL
);

CREATE INDEX characteristic_id ON characteristic_reviews (characteristic_id);

COPY reviews FROM 's3://arn:aws:s3:us-west-1:892190585624:accesspoint/reviewsaccess/reviews_cleaned.csv' WITH (FORMAT CSV);

-- COPY images FROM '/Users/jacobwpeterson/Downloads/reviews_photos_cleaned.csv' WITH (FORMAT CSV);

COPY characteristics FROM 's3://arn:aws:s3:us-west-1:892190585624:accesspoint/reviewsaccess/characteristics.csv' WITH HEADER CSV;

COPY characteristic_reviews FROM 's3://arn:aws:s3:us-west-1:892190585624:accesspoint/reviewsaccess/characteristic_reviews.csv' WITH HEADER CSV;
