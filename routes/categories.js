const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');
const csv = require('csv-parser');
const fs = require('fs');


const Categories = require("../model/Categories");




router.get("/getAll",async (req, res) => {
    Categories.find({})
        .then(oProduct => {
            res.send(oProduct);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the product."
        });
    });
});


module.exports = router;