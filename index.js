const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user"); //new addition
const distributor = require("./routes/distributor"); //new addition
const product = require("./routes/product"); //new addition
const community = require("./routes/community"); //new addition
const cart = require("./routes/cart");
const order = require("./routes/order");
const cors = require('cors');


const InitiateMongoServer = require("./config/db");

const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: 'rzp_live_nnHybgj06vaLi0',
  key_secret: 'msCsKjZniUKZUMgdoOLLKDW2',
});


InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.use("/user", user);
app.use("/distributor", distributor);
app.use("/product", product);
app.use("/community", community);
app.use("/cart", cart);
app.use("/order", order);


app.post('/orders', (req, res) => {
  instance.orders.create(req.body, (err, order) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(order);
    }
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
