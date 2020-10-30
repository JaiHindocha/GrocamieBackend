const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user"); //new addition
const product = require("./routes/product"); //new addition
const community = require("./routes/community"); //new addition


const InitiateMongoServer = require("./config/db");

InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.use("/user", user);
app.use("/product", product);
app.use("/community", community);



app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});