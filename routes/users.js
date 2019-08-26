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
})

  


  // res.locals -> for views
  // res.redirect to login
  // else{
    // next()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/landing', (req,res,next) => {
  const getTrips = `
  SELECT * from trips
  where id = $1`;
  const genTrips = db.any(getTrips, [req.session.userObject.id]);
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
  const getMyTrips = `
  SELECT * FROM trips
  WHERE creator_id = $1
  `
  db.any(getMyTrips, [req.session.userObject.id]).then((results) => {
    res.render('myTrips', {
      userTrips: results
    });
  })
 
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
  const name = req.body.name;
  const email = req.body.email;
  const city = req.body.city;
  const country = req.body.country;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const creator_id = req.session.userObject.id;
  const description = req.body.description;
  
  // const createTripQuery = 
  createTrip()
  function createTrip(){
  const createTripQuery = `
  INSERT INTO trips
    (name, city, country, start_date, end_date, creator_id, description)
  VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    returning id
  `
  db.one(createTripQuery,[name, city, country, start_date, end_date, creator_id, description])
  .then((resp)=>{
        res.redirect('/users/myProfile')
      })
  }
});

router.get('/myTrips', (req,res,next) => {
  res.render('myTrips');  
  //
});

router.get('/userProfiles/:userId', (req,res,next) => {
  let userId = req.params.userId
  let userDataQuery = `
    select *
    from users
    where id = $1`
  let userTripsQuery = `
    select trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description 
    from trips, users, attendance
    where trips.creator_id = users.id and users.id = $1
    or trips.id = attendance.trip_id and attendance.user_id = users.id and users.id = $1
    group by trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description
    order by trips.end_date desc;`
    let userTripsCreatedQuery = `
    select count(trips.name) 
    from trips, users
    where trips.creator_id = users.id and users.id = $1;`
    let userTripsAttendedQuery = `
    select count(attendance.id) 
    from attendance, users
    where attendance.user_id = users.id and users.id = $1;`
  let userData = db.any(userDataQuery, [userId])
  let userTrips = db.any(userTripsQuery, [userId])
  let userTripsCreated= db.any(userTripsCreatedQuery, [userId])
  let userTripsAttended= db.any(userTripsAttendedQuery, [userId])
  userData.then((udt) => {
    let userDataData = udt[0]
    userTrips.then((utd)=>{
      let userTripsData = utd
      userTripsCreated.then((utcd)=>{
        let userTripsCreatedData = utcd[0]
        userTripsAttended.then((utad)=>{
          let userTripsAttendedData = utad[0]
          // res.json(userTripsData)
          res.render('userGeneral', {
            userData: userDataData,
            userTrips: userTripsData,
            userTripsCreated: userTripsCreatedData,
            userTripsAttended: userTripsAttendedData
          })
        })
      })
    })

  })
  // res.render('userGeneral');  
  //
});



module.exports = router;
