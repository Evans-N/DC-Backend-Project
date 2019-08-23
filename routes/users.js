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

router.use((req,res,next)=>{
  if(req.session.userObject){
    res.locals.id = req.session.userObject.id
    res.locals.first_name = req.session.userObject.first_name
    res.locals.email = req.session.userObject.email
    next()
  } else {
    res.redirect('/?msg=notLoggedIn')
  }


  // res.locals -> for views
  // res.redirect to login
  // else{
    // next()
})

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
      (name, city, country, start_date, end_date, creator_id, description)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      returning id
  `
  db.one(createTripQuery,[name, city, country, start_date, end_date, creator_id, description]).then((resp)=>{
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
