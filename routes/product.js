const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');

const Product = require("../model/Product");

router.get("/all",async (req, res) => {
     Product.find({})
         .then(oProduct => {
             res.send(oProduct);
         }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while retrieving the product."
         });
     });
});

// router.get("/get", async (req, res) => {
//   // const errors = validationResult(req);
//   // if (!errors.isEmpty()) {
//   //   return res.status(400).json({
//   //     errors: errors.array()
//   //   });
//   // }
//
//   const {search, category, sortKey, sortOrder, itemsPerPage, pageNo}= req.body;
//
//   var skips = itemsPerPage * (pageNo - 1)
//
//   let dbReq;
//   if (!(search == null || search == "") && !(category == null || category == "")) {
//     var searchSplit = search.split(" ");
//     dbReq = Product.find({keywords: {$in: searchSplit}, category: category});
//
//   }
//
//   else if (!(category == "" || category == null)){
//     dbReq = Product.find({keywords: category});
//   }
//
//   else {
//     var searchSplit = search.split(" ");
//     dbReq = Product.find({keywords: {$in: searchSplit}});
// }
// // If sortKEy present
// if (!(sortKey == null || sortKey == "")){
//   var query = {};
//   query[sortKey] = sortOrder;
//   dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
//   dbReq.then(oProduct => {
//     res.send(oProduct);
//   }).catch(err => {
//     res.status(500).send({
//       message: err.message || "Some error occurred while retrieving the product."
//     });
//   })
// }
// else {
//   res.send(dbReq)
// }
// });

router.post("/get", async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     errors: errors.array()
  //   });
  // }

  const {search, category, sortKey, sortOrder, itemsPerPage, pageNo}= req.body;


  var skips = itemsPerPage * (pageNo - 1)

  let dbReq;
  if (!(search == null || search == "") && !(category == null || category == "")) {
    dbReq = Product.find({$text: {$search: search}, category: category, availability: "Y"}, { score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } );

  }

  else if (!(category == "" || category == null)){
    dbReq = Product.find({category: category, availability: "Y"});
  }

  else if ((category == "" || category == null) && (search == null || search == "")){
    dbReq = Product.find({availability: "Y"});
  }

  else {
    dbReq = Product.find({$text: {$search: search}, availability: "Y"}, { score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } );
}
// If sortKEy present
if (!(sortKey == null || sortKey == "")){
  var query = {};
  query[sortKey] = sortOrder;
  dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
  dbReq.then(oProduct => {
    res.send(oProduct);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the product."
    });
  })
}
else {
  dbReq = dbReq.skip(skips).limit(itemsPerPage);
  dbReq.then(oProduct => {
    res.send(oProduct);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the product."
    });
  })
}
});





module.exports = router;
