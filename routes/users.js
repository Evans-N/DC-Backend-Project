var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
require('dotenv');
// const sessionOptions = {
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }
// router.use(expressSession(sessionOptions));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/landing', (req,res,next) => {
  const getTrips = `
  SELECT * from trips`;
  const genTrips = db.any(getTrips);
  console.log('starting');
  genTrips.then((results)=> {
    // res.send(results)
    res.render('landing', {
      tripInfo: results
    })
  })
  //MY PROFILE
  //MY TRIPS
  //VIEW TRIPS
});

//========USER============//
router.get('/myProfile', (req,res,next) => {
  res.render('myProfile');
  //INDIVIDUAL USER PROFILE
  //USER TRIPS
});

router.get('/myTrips', (req,res,next) => {
  res.render('myTrips');
  //INDIVIDUAL USER PROFILE
  //USER TRIPS
});

router.get('/profile/friends', (req,res,next) => {
  res.render('friends');
  //
});

router.get('/friends', (req,res,next) => {
  res.render('friends');
  //
});


router.get('/tripCreate', (req,res,next) => {
  res.render('tripCreate');
});

router.post('/tripCreateProcess', (req,res,next) => {
  const createTripQuery = `
    INSERT INTO trips
      (tripName, tripLocation)
    VALUES
      ($1,$2,$3)
      returning id
  `
  db.one(createTripQuery,[tripName,tripLocation]).then((resp)=>{
    res.json({
      msg: "Trip Created!"
    })
  })
  //
});

router.get('/myTrips', (req,res,next) => {
  res.render('myTrips');  
  //
});



module.exports = router;
