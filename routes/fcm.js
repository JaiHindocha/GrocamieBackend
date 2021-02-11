const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');
const csv = require('csv-parser');
const fs = require('fs');



router.post("/send", async(req, res) =>{
    res.header('Content-Type', "application/json");
    res.header('Authorization', "key=$SERVER_KEY");
    res.redirect('https://fcm.googleapis.com/fcm/send')


});


module.exports = router;