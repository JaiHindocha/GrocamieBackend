const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const url = require('url');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const Cart = require('../model/Cart');
const Community = require('../model/Community');
const MasterOrder = require('../model/MasterOrder');
const Order = require('../model/Order');
const MasterCart = require('../model/MasterCart');

router.post('/create', auth, async (req, res) => {
  function func() {
    return Cart.find({ _id: req.user.id });
  }

  async function asyncCall() {
    const data = await func();
    var productCart = data[0]['products'];
    var total = data[0]['total'];

    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      '/' +
      (currentdate.getMonth() + 1) +
      '/' +
      currentdate.getFullYear() +
      ' @ ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();

    order = new Order({
      _userId: req.user.id,
      timestamp: datetime,
      products: productCart,
      total: total,
    });

    await order.save();

    // expected output: "resolved"
  }

  asyncCall();
  res.send('Order Created');

  // var currentdate = new Date();
  // var datetime = currentdate.getDate() + "/"
  //               + (currentdate.getMonth()+1)  + "/"
  //               + currentdate.getFullYear() + " @ "
  //               + currentdate.getHours() + ":"
  //               + currentdate.getMinutes() + ":"
  //               + currentdate.getSeconds();
  //
  // order = new Order({
  //   _id: req.user.id,
  //   timestamp: datetime
  // });
  //
  // await order.save();
  // var cart = {};
  //    Cart.find({_id: req.user.id}, {products: 1, _id:0}, (err, data) =>{
  //          for (var i=0; i < data[0]["products"].length; i++){
  //            if (!(data[0]["products"][i]["_productId"] in cart)){
  //              cart[data[0]["products"][i]["_productId"]] = data[0]["products"][i]["quantity"];
  //            }
  //            else {
  //              cart[data[0]["products"][i]["_productId"]] += data[0]["products"][i]["quantity"];
  //            }
  //          }
  //
  //      for (let product in cart){
  //        Order.updateOne({_userId: req.user.id, timestamp: datetime}, {$push: {products:{_productId: product, quantity: cart[product]}}})
  //            .catch(err => {
  //                 res.status(500).send({
  //                     message: err.message || "Some error occurred while retrieving the product."
  //                 });
  //             });
  //        Cart.updateOne({_id: req.user.id}, {$pull: {"products": {"_productId": product}}})
  //            .catch(err => {
  //                res.status(500).send({
  //                  message: err.message || "Some error occurred while retrieving the product."
  //                });
  //            });
  //       }
  //
  //      res.send("Order Created");
  //   });
});

router.post('/createMaster', auth, async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     errors: errors.array()
  //   });
  // }
  if (req.user.alpha == true) {
    function func() {
      return MasterCart.find({ _id: req.user.id });
    }

    async function asyncCall() {
      const data = await func();
      var productCart = data[0]['products'];
      var total = data[0]['total'];

      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        '/' +
        (currentdate.getMonth() + 1) +
        '/' +
        currentdate.getFullYear() +
        ' @ ' +
        currentdate.getHours() +
        ':' +
        currentdate.getMinutes() +
        ':' +
        currentdate.getSeconds();

      masterOrder = new MasterOrder({
        _alphaId: req.user.id,
        timestamp: datetime,
        products: productCart,
        total: total,
      });

      await masterOrder.save();

      // expected output: "resolved"
    }

    asyncCall();
    res.send('Master Order Created');

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
    //     for (let product in cart){
    //       MasterOrder.updateOne({_alphaId: req.user.id, timestamp: datetime}, {$push: {products:{_productId: product, quantity: cart[product]}}})
    //           .catch(err => {
    //                res.status(500).send({
    //                    message: err.message || "Some error occurred while retrieving the product."
    //                });
    //            });
    //       Cart.updateMany({_id: {$in: betaId}}, {$pull: {"products": {"_productId": product}}})
    //           .catch(err => {
    //               res.status(500).send({
    //                 message: err.message || "Some error occurred while retrieving the product."
    //               });
    //           });
    //     }
  } else {
    res.status(500).send({
      message: 'The user is not a community leader.',
    });
  }
});

module.exports = router;
