const express = require("express");
const router = express.Router();

const Product = require("../model/Product");

router.get("/productAll",async (req, res) => {
     Product.find({})
         .then(oProduct => {
             res.send(oProduct);
         }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while retrieving the product."
         });
     });

});

module.exports = router;