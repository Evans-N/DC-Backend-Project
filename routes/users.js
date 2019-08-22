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

router.get('/landing', (res,req,next) => {
  //MY PROFILE
  //MY TRIPS
  //VIEW TRIPS
});

router.get('/profile', (res,req,next) => {
  //INDIVIDUAL USER PROFILE
  //USER TRIPS
});

router.get('/profile/friends', (res,req,next) => {
  //
});

//========TRIPS===========//
router.get('/createTrip', (res,req,next) => {
  //
});

router.post('/createTrip', (res,req,next) => {
  //
});

router.get('/myTrips', (res,req,next) => {
  //
});



module.exports = router;
