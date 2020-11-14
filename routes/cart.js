const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");



const Cart = require("../model/Cart");
const Community = require("../model/Community");
const MasterCart = require("../model/MasterCart");
const Product = require("../model/Product");


// function setTotal(id, masterCart){
//     if (masterCart == true){
//       MasterCart.find({_id: id}, (err, data) => {
//
//       });
//
//     }
//     else{
//
//     }
//
// }

router.get("/get", auth, async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     errors: errors.array()
  //   });
  // }

  // const {productId}= req.body;
  Cart.find({_id: req.user.id})
         .then(oCart => {
             res.send(oCart);
         }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while retrieving the product."
         });
     });
});

router.post("/add", auth, async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     errors: errors.array()
  //   });
  // }

// !!This function can be used to decrease quantity as well!!

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
//{_id: productId, quantity: 1}}}, {upsert: true})
  const {productId, quantity}= req.body;
//   db.users.update({_id: id}, {
//   $inc: {visit_count: 1},
//   $set: {_id: id}
// }, {upsert: true})
  Cart.find({_id: req.user.id, products: {$elemMatch: {_productId: productId}}}, (err, data) => {
    // Cart.update(conditions, {$inc: {"products.$.quantity":quantityToAdd}});

    console.log(data);


    if(!Array.isArray(data) || !data.length){

      Cart.updateOne({_id: req.user.id}, {$push: {products:{_productId: productId, quantity: quantity}}})
          .then(oCart => {
                  res.send(oCart);
               }).catch(err => {
               res.status(500).send({
                   message: err.message || "Some error occurred while retrieving the product."
               });
           });



    }
    else{

      Cart.findOneAndUpdate({_id: req.user.id, products: {$elemMatch: {_productId: productId}}}, {$inc: {"products.$.quantity":quantity}}, {new: true}, (err, data) => {

        if((data["products"].find(product => product._productId === productId).quantity) <= 0) {

          Cart.update({_id: req.user.id}, {$pull: {"products": {"_productId": productId}}})
                .then(oCart => {
                        res.send(oCart);
                     }).catch(err => {
                     res.status(500).send({
                         message: err.message || "Some error occurred while retrieving the product."
                     });
                 });


      }



      });

      // Cart.updateOne({_id: req.user.id, "products._productId":productId}, {$inc: {"products.$.quantity":quantity}})
      //     .then(oCart => {
      //             res.send(oCart);
      //          }).catch(err => {
      //          res.status(500).send({
      //              message: err.message || "Some error occurred while retrieving the product."
      //          });
      //      });
      //
      // if(data[0]["products"].some(e => e._productId == productId && (e.quantity + quantity) == 0)) {
      //
      //   Cart.update({_id: req.user.id}, {$pull: {"products": {"_productId": productId}}})
      //       .then(oCart => {
      //               res.send(oCart);
      //            }).catch(err => {
      //            res.status(500).send({
      //                message: err.message || "Some error occurred while retrieving the product."
      //            });
      //        });
      //
      // }

    }
  });

    if (req.user.alpha == true){
      var alphaId = req.user.id;
    }
    else{
      var alphaId = req.user.leaderUid;
    }

    MasterCart.find({_id: alphaId, products: {$elemMatch: {_productId: productId}}}, (err, data) => {
      // Cart.update(conditions, {$inc: {"products.$.quantity":quantityToAdd}});


      if(!Array.isArray(data) || !data.length){
        MasterCart.updateOne({_id: alphaId}, {$push: {products:{_productId: productId, quantity: quantity}}})
            .then(oCart => {
                    res.send(oCart);
                 }).catch(err => {
                 res.status(500).send({
                     message: err.message || "Some error occurred while retrieving the product."
                 });
             });



      }
      else{

        MasterCart.findOneAndUpdate({_id: alphaId, products: {$elemMatch: {_productId: productId}}}, {$inc: {"products.$.quantity":quantity}}, {new: true}, (err, data) => {

          if((data["products"].find(product => product._productId === productId).quantity) <= 0) {

            MasterCart.update({_id: alphaId}, {$pull: {"products": {"_productId": productId}}})
                  .then(oCart => {
                          res.send(oCart);
                       }).catch(err => {
                       res.status(500).send({
                           message: err.message || "Some error occurred while retrieving the product."
                       });
                   });

          }
        });

        // MasterCart.updateOne({_id: alphaId}, {products: {$elemMatch: {_productId: productId}}}, {$inc: {"products.$.quantity":quantity}})
        //     .then(oCart => {
        //             res.send(oCart);
        //          }).catch(err => {
        //          res.status(500).send({
        //              message: err.message || "Some error occurred while retrieving the product."
        //          });
        //      });
        //
        // if(data[0]["products"].some(e => e._productId == productId && (e.quantity + quantity) == 0)) {
        //   MasterCart.update({_id: alphaId}, {$pull: {"products": {"_productId": productId}}})
        //       .then(oCart => {
        //               res.send(oCart);
        //            }).catch(err => {
        //            res.status(500).send({
        //                message: err.message || "Some error occurred while retrieving the product."
        //            });
        //        });
        //
        // }

      }

      Product.find({_id: productId}, (err, data) => {
        var price = data[0]["sp"];

          Cart.updateOne({_id: req.user.id}, {$inc: {"total":(quantity*price)}})
              .then(oCart => {
                      res.send(oCart);
                   }).catch(err => {
                   res.status(500).send({
                       message: err.message || "Some error occurred while retrieving the product."
                   });
               });




        MasterCart.updateOne({_id: alphaId}, {$inc: {"total":(quantity*price)}})
            .then(oCart => {
                    res.send(oCart);
                 }).catch(err => {
                 res.status(500).send({
                     message: err.message || "Some error occurred while retrieving the product."
                 });
             });


      });

  });



});

router.post("/delete", auth, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }


  const {productId}= req.body;

  if (req.user.alpha == true){
    var alphaId = req.user.id;
  }
  else{
    var alphaId = req.user.leaderUid;
  }



  Cart.find({_id: req.user.id, products: {$elemMatch: {_productId: productId}}}, (err, data) => {

    var quantity = -1 * (data[0]["products"].find(product => product._productId === productId).quantity);

    Cart.update({_id: req.user.id}, {$pull: {"products": {"_productId": productId}}})
        .then(oCart => {
                res.send(oCart);
             }).catch(err => {
             res.status(500).send({
                 message: err.message || "Some error occurred while retrieving the product."
             });
         });

         MasterCart.findOneAndUpdate({_id: alphaId, products: {$elemMatch: {_productId: productId}}}, {$inc: {"products.$.quantity":quantity}}, {new: true}, (err, data) => {

           if((data["products"].find(product => product._productId === productId).quantity) <= 0) {

             MasterCart.update({_id: alphaId}, {$pull: {"products": {"_productId": productId}}})
                   .then(oCart => {
                           res.send(oCart);
                        }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving the product."
                        });
                    });
          }
        });


          Product.find({_id: productId}, (err, data) => {
            var price = data[0]["sp"];

              Cart.updateOne({_id: req.user.id}, {$inc: {"total":(quantity*price)}})
                  .then(oCart => {
                          res.send(oCart);
                       }).catch(err => {
                       res.status(500).send({
                           message: err.message || "Some error occurred while retrieving the product."
                       });
                   });




            MasterCart.updateOne({_id: alphaId}, {$inc: {"total":(quantity*price)}})
                .then(oCart => {
                        res.send(oCart);
                     }).catch(err => {
                     res.status(500).send({
                         message: err.message || "Some error occurred while retrieving the product."
                     });
                 });


          });

});

});


router.get("/masterCart", auth, async (req, res) => {

  if (req.user.alpha == true)
  {
    MasterCart.find({_id: req.user.id})
        .then(oCart => {
                res.send(oCart);
             }).catch(err => {
             res.status(500).send({
                 message: err.message || "Some error occurred while retrieving the product."
             });
         });

    // Community.find({leaderUid: req.user.id}, { betaUsers: 1, _id: 0}, (err, data) =>{
    //   var cart = {};
    //   var betaId = data[0]["betaUsers"];
    //   Cart.find({_id: {$in: betaId}}, {products: 1, _id:0}, (err, data) =>{
    //       for (var i =0; i < data.length; i++){
    //         for (var j=0; j < data[i]["products"].length; j++){
    //           if (!(data[i]["products"][j]["_productId"] in cart)){
    //             cart[data[i]["products"][j]["_productId"]] = data[i]["products"][j]["quantity"];
    //           }
    //           else {
    //             cart[data[i]["products"][j]["_productId"]] += data[i]["products"][j]["quantity"];
    //           }
    //         }
    //       }
    //
    //     res.send(cart)
    //     });
    //
    // });
  }
  else {
    res.status(500).send({
        message: "The user is not a community leader."
    });
  }
});




  // result.tojson();

//   Cart.update(conditions, { $set: {"products._productId":productId}, $inc: {"products.$.quantity":quantityToAdd}}, {upsert: true})
//          .then(oCart => {
//              res.send(oCart);
//          }).catch(err => {
//          res.status(500).send({
//              message: err.message || "Some error occurred while retrieving the product."
//          });
//      });
// });


module.exports = router;
