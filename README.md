# Atelier
Retail server and database optimization \
*by*\
[Jacob Peterson](https://github.com/JacobWPeterson)

---

## Technologies Used
1. PostgreSQL
2. Node/Express.js
3. AWS (EC2 and S3)
4. NGINX
5. Artillery.io
6. Loader.io
7. New Relic

## Overview
The code contained in this repository was my responsibility, but fits within and cooperates with a larger code base available [here](https://github.com/MMSDC).

I inherited a front end and sub-optimal API capable of handling only a few requests per second. The goal was to scale it as high as possible within the constrains of an AWS Free Tier account using EC2s.

## Outcomes
* Sub-millisecond database response times
* Scaled microservice to handle 2500 RPS with a 0% failure/error rate and 70ms average response time deployed on an AWS EC2 instance, representing a 5:1 server:database distribution where total response time was evenly distributed between the node server and Postgres database.

### Loader.io Output at 4:1 Server:DB
<img src="https://github.com/JacobWPeterson/Atelier/blob/master/LoaderIOExample.png" alt="loader.io results" width=775px />
