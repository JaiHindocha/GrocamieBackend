const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Community = require("../model/Community");

router.post(
  "/create",[],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    // {
    //   leaderUid:,
    //   betaUsers:,
    //   name:,
    //   requests:,
    //   closingTime:
    // }


    const {communityCode,betaUsers,name,requests,closingTime} = req.body;
    try {

      community = new Community({
        communityCode,
        betaUsers,
        name,
        requests,
        closingTime
      });

      await community.save();
      res.status(200).json({
        community
      });

    }
    catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

// router.put(
//     "/addLeader",
//     function (req, res) {
//       var conditions = {_id: req.body.communityid};
//       var set = {$set:{leaderUid:req.body.leaderUid}};
//       // {
//       //   "leaderUid":"",
//       //   "comunityid":""
//       // }
//       Community.update(conditions, set).then(doc => {
//           if (!doc) {return res.status(404).end();}
//           return res.status(200).json(doc);
//       })
//       .catch(err => next(err));
//     }
// );

router.put(
  "/setClosingTime",
  function (req, res) {
    if(req.user.alpha==1){
      var conditions = {_id: req.body.communityid};
      var set = {$set:{closingTime:req.body.closingTime}};
      // {
      //   "communityid":"",
      //   "closingTime":""
      // }
      Community.update(conditions, set).then(doc => {
          if (!doc) {return res.status(404).end();}
          return res.status(200).json(doc);
      })
      .catch(err => next(err));
    }
  }
);

router.get("/closingTime", auth, async (req, res) => {
  try {
      const user = await Community.find({communityid:req.body.communityid});
      if(user && user.length){
          res.json(closingTime);
      }
      else{
          res.json("0 (no closing time)");
      }
  }
  catch (e) {
       res.send({ message: "Error in Fetching user" });
  }
});

router.put(
  "/sendRequest",
  function (req, res) {
    // {
    //   communityid:
    // }
    var conditions = {_id: req.body.communityid};
    var push = {$push: {requests: req.body.communityid}};

    Community.update(conditions, push).then(doc => {
        if (!doc) {return res.status(404).end();}
        return res.status(200).json(doc);
    })
    .catch(err => next(err));
  }
);

router.put(
    "/approve",[],auth,
    async (req, res) => {
      if(req.user.alpha==1){
      // {
      //   id:
      // }
      var conditions = {communityCode: req.user.communityCode};
      var push = {$push: {betaUsers: req.body.id}};
      var pull = {$pull: {requests:req.body.id }};

      Community.update(conditions,push).then(doc => {
          if (!doc) {return res.status(404).end();}
          return res.status(200).json(doc);
      })
      .catch(err => next(err));
      Community.update(conditions,pull).then(doc => {
        if (!doc) {return res.status(404).end();}
        return res.status(200).json(doc);
    })
    .catch(err => next(err));
    }
  }
  );

router.get("/requests", auth, async (req, res) => {
  if(req.user.alpha==1){
    try {
      const user = await Community.find({communityCode: req.user.communityCode},{requests:1});
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  }
  else{
    res.json({ message: "Not alpha user" })
  }
});

module.exports = router;