const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user'); //new addition
const product = require('./routes/product'); //new addition
const community = require('./routes/community'); //new addition
const cart = require('./routes/cart');
const order = require('./routes/order');

const InitiateMongoServer = require('./config/db');
const morgan = require('morgan');

InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Working' });
});

app.use('/user', user);
app.use('/product', product);
app.use('/community', community);
app.use('/cart', cart);
app.use('/order', order);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
