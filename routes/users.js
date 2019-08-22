var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
require('dotenv');
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}
router.use(expressSession(sessionOptions));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/landing', (req,res,next) => {
  res.render('landing');
  //MY PROFILE
  //MY TRIPS
  //VIEW TRIPS
});

router.get('/profile', (req,res,next) => {
  res.render('profile');
  //INDIVIDUAL USER PROFILE
  //USER TRIPS
});

router.get('/profile/friends', (req,res,next) => {
  res.render('friends');
  //
});

//========TRIPS===========//
router.get('/createTrip', (req,res,next) => {
  res.render('createTrip');
  //
});

router.post('/createTrip', (req,res,next) => {
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
