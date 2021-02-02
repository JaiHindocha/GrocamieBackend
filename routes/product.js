const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');
const csv = require('csv-parser');
const fs = require('fs');


const Product = require("../model/Product");
const Manufacturer = require("../model/Manufacturer");

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

router.post("/productById", async (req, res) => {
  try {
    const user = await Product.find({_id:req.body.id});
    res.json(user);
  }
  catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
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

router.post("/get", async(req, res) => {

  var {search, category, sortKey, sortOrder, itemsPerPage, pageNo, community, searchType}= req.body;
  
  var skips = itemsPerPage * (pageNo - 1)
  var agg = false
  let dbReq;

  if (category == "Biscuits, Snacks & Chocolates"){
    category = "Confectionery and Snacks "
  }

  if (searchType == "Best Seller"){
    sortKey = "discount"
    sortOrder = -1
  }
  else if (searchType == "Lowest Prices"){
    sortKey = "sp"
    sortOrder = 1
  }



  function func() {
    return (Manufacturer.find({communities: community}, {_id:0, communities:0}));

  };

  
  try {

   
  if  (!(community == null || community == "")){

    var data = await func();
   
   var deliver = data.map(function(data) {return data['name'];
});

    if (!(search == null || search == "") && !(category == null || category == "")) {

      agg = true
  
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
  
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, category: category, manufacturer: {$in: deliver}, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            {$match: { sortValue: { $gt: 0.5 } } },
            {$sort: query},
            {$skip: skips},
            {$limit: itemsPerPage}
            ]);
      }
      else {
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, category: category, manufacturer: {$in: deliver}, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            {$match: { sortValue: { $gt: 0.5 } } },
            {$skip: skips},
            {$limit: itemsPerPage}
            ]);
  
      }
    }
  
  
  
    else if (!(category == "" || category == null)){
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = Product.find({category: category, manufacturer: {$in: deliver}, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
    }
  
      else{
        dbReq = Product.find({category: category, manufacturer: {$in: deliver}, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.skip(skips).limit(itemsPerPage);
  
      }
  }
    else if ((category == "" || category == null) && (search == null || search == "")){
  
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = Product.find({manufacturer: {$in: deliver}, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
      }
      else {
        dbReq = Product.find({manufacturer: {$in: deliver}, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.skip(skips).limit(itemsPerPage);
      }
  }
  
    else {
      agg = true
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, manufacturer: {$in: deliver}, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            { $match: { sortValue: { $gt: 0.5 } } },
            {$sort: query},
            {$skip: skips},
            {$limit: itemsPerPage}
          ]
          );
      }
    else{
      dbReq = await Product.aggregate(
        [
          {$match: { $text: {$search: search}, manufacturer: {$in: deliver}, availability: "Y"}},
          {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 5]}]}}},
          {$sort: {sortValue:-1}},
          { $match: { sortValue: { $gt: 1.0 } } },
          {$skip: skips},
          {$limit: itemsPerPage}
        ]
        );
  
    }
  
  }
  
  if (agg == false){
  dbReq.then(oProduct => {
    res.send(oProduct);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the product."
    });
  })
  }
  else {
    res.json(dbReq);
  }

  }
//////////////////////////////////////////////////////
  else{
    if (!(search == null || search == "") && !(category == null || category == "")) {

      agg = true
  
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
  
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, category: category, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            {$match: { sortValue: { $gt: 0.5 } } },
            {$sort: query},
            {$skip: skips},
            {$limit: itemsPerPage}
            ]);
      }
      else {
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, category: category, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            {$match: { sortValue: { $gt: 0.5 } } },
            {$skip: skips},
            {$limit: itemsPerPage}
            ]);
  
      }
    }
  
  
  
    else if (!(category == "" || category == null)){
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = Product.find({category: category, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
    }
  
      else{
        dbReq = Product.find({category: category, availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.skip(skips).limit(itemsPerPage);
  
      }
  }
    else if ((category == "" || category == null) && (search == null || search == "")){
  
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = Product.find({availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.sort(query).skip(skips).limit(itemsPerPage);
      }
      else {
        dbReq = Product.find({availability: "Y"}).sort({PriorityIndex:-1});
        dbReq = dbReq.skip(skips).limit(itemsPerPage);
      }
  }
  
    else {
      agg = true
      if (!(sortKey == null || sortKey == "")){
        var query = {};
        query[sortKey] = sortOrder;
        dbReq = await Product.aggregate(
          [
            {$match: { $text: {$search: search}, availability: "Y"}},
            {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
            {$sort: {sortValue:-1}},
            { $match: { sortValue: { $gt: 0.5 } } },
            {$sort: query},
            {$skip: skips},
            {$limit: itemsPerPage}
          ]
          );
      }
    else{
      dbReq = await Product.aggregate(
        [
          {$match: { $text: {$search: search}, availability: "Y"}},
          {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 5]}]}}},
          {$sort: {sortValue:-1}},
          { $match: { sortValue: { $gt: 1.0 } } },
          {$skip: skips},
          {$limit: itemsPerPage}
        ]
        );
  
    }
  
  }
  
  if (agg == false){
  dbReq.then(oProduct => {
    res.send(oProduct);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the product."
    });
  })
  }
  else {
    res.json(dbReq);
  }
  }
  
 
  

}

catch(e){
  console.log(e)
}

});

// try {
//   const product = await Product.aggregate(
//     [
//       {$match: { $text: { $search: search }, availability: "Y"}},
//       {$addFields: {sortValue:{$add: [{$meta: "textScore"}, {$divide: ["$PriorityIndex", 10]}]}}},
//       {$sort: {sortValue:-1}}
//       { $match: { sortValue: { $gt: 0.5 } } }
//     ]
//     );
//
//     res.json(product);
//
//   }
//
//   catch (e){
//     console.log(e);
//   }
//
// });

router.post("/getOld", async (req, res) => {
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
    dbReq = Product.find({category: category, availability: "Y"}).sort({PriorityIndex:-1});
  }

  else if ((category == "" || category == null) && (search == null || search == "")){
    dbReq = Product.find({availability: "Y"}).sort({PriorityIndex:-1});
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



router.post("/import", async (req, res) => {

  Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Get the size of an object
     
   var obj = {};
   obj["empty"] = [];
   obj["newId"] = [];  


  try{
    await Product.deleteMany({});
    console.log("Products Deleted");
  }
  catch(e){
    res.send(e);
  }
  var empty = 0
  var count = 0


  fs.createReadStream('GrocamieTestingProducts.csv')
  .pipe(csv())
  .on('data', (row) => {
    empty += 1
    if (row["name"] == '' || row["name"] == "name"){
      obj["empty"].push(empty);
    }

    else{
    count+=1
    if (row["_id"] == ''){
      async function asyncCall() {
        try{
            const product = new Product({
              name : row["name"],
              brand : row["brand"],
              manufacturer : row["manufacturer"],
              PriorityIndex : row["PriorityIndex"],
              category : row["category"],
              subCategory : row["subCategory"],
              sp : row["sp"],
              marginP : row["margin%"],
              mrp : row["mrp"],
              DealerPrice : row["DealerPrice"],
              discount : row["discount"],
              gst : row["gst"],
              weight : row["weight"],
              availability : row["availability"],
              description : row["description"],
              imageUrl : row["imageUrl"],
              productImageUrl : row["productImageUrl"] });
            
            obj["newId"].push(product.id); 
            await product.save();

        }
        catch(e){
          res.send(e);
        }
      }

      asyncCall();
    }
    else{
    async function asyncCall() {
      try{
          id = row["_id"].slice(9,33);
          const product = new Product({
            _id : id,
            name : row["name"],
            brand : row["brand"],
            manufacturer : row["manufacturer"],
            PriorityIndex : row["PriorityIndex"],
            category : row["category"],
            subCategory : row["subCategory"],
            sp : row["sp"],
            marginP : row["margin%"],
            mrp : row["mrp"],
            DealerPrice : row["DealerPrice"],
            discount : row["discount"],
            gst : row["gst"],
            weight : row["weight"],
            availability : row["availability"],
            description : row["description"],
            imageUrl : row["imageUrl"],
            productImageUrl : row["productImageUrl"] });

          await product.save();

      }
      catch(e){
        res.send(e);
      }
    }

    asyncCall();

    // var size = Object.size(row);
    // console.log(size);
  }
}
  })
  .on('end', () => {
    obj["count"] = count;
    obj["done"] = "done";   
    res.send(obj);   

  });




});





module.exports = router;
