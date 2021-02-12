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
    res.header('Authorization', "key=AAAAZTt3e3w:APA91bHR9lVHIpEE9y9efNkD6L6RQ1HgTf9uttDOjvepznYhMXcjU29JDdcOl5y1Ot6eU4M0o530e5nL4UdPem6X-XUySUPQA5NKSnfsTMOeTgBFzeSna-GHM950BEsOejFQnqzjB-zM");
    console.log(res._headers)
    res.redirect('https://fcm.googleapis.com/fcm/send')


});


module.exports = router;