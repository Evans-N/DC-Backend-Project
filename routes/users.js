var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const fs = require("fs");
require('dotenv');
var multer = require("multer"); //multi part form uploads...allows uploading of images
var upload = multer({dest:'public/images/userImages'})
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/landing', (req,res,next) => {
  const getTrips = `
  SELECT * from trips
  order by id desc
  LIMIT 5`;
  const genTrips = db.any(getTrips);
  console.log('starting');
  genTrips.then((results)=> {
    res.render('landing', {
      tripInfo: results
    })
  })
  //MY PROFILE
  //MY TRIPS
  //VIEW TRIPS
});

//========USER============//

router.get('/myTrips', (req,res,next) => {
  const getMyTrips = `
  select trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
  from trips, users, attendance
  where trips.creator_id = users.id and users.id = $1
  or trips.id = attendance.trip_id and attendance.user_id = users.id and users.id = $1
  group by trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
  order by trips.end_date desc
  limit 3;`

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


router.post('/tripCreateProcess', upload.single("trip_img"), (req,res,next) => {
  console.log(req.file)
  const newPath = `public/images/userImages/${req.file.originalname}`;
  fs.rename(req.file.path, newPath, (err)=>{
    if(err) throw error;
  })
  const picture = `/images/userImages/${req.file.originalname}`
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
    (name, city, country, start_date, end_date, creator_id, description, picture)
  VALUES
    ($1,$2,$3,$4,$5,$6,$7, $8)
    returning id
  `
  console.log(createTripQuery)
  db.one(createTripQuery,[name, city, country, start_date, end_date, creator_id, description, picture])
  .then((resp)=>{
        res.redirect('/users/myProfile')
      })
  }
});

router.get('/trips/:tripId', (req, res, next) => {
  let user = req.session.userObject
  let tripId = parseInt(req.params.tripId)
  let tripDataQuery = `
    select *
    from trips
    where id = $1;`
  let tripAttendanceQuery = `
    select users.* from trips, users, attendance
    where attendance.trip_id = trips.id 
    and attendance.user_id = users.id 
    and trips.id = $1;`
  let tripCreatorQuery = `
    select users.* from trips, users
    where trips.creator_id = users.id
    and trips.id = $1;`
  let tripData = db.one(tripDataQuery, [tripId])
  let tripAttendance = db.any(tripAttendanceQuery, [tripId])
  let tripCreator = db.one(tripCreatorQuery, [tripId])
  tripData.then((tD) => {
    let tripDataData = tD //returns the trip data as an object
    tripAttendance.then((tA)=>{
      let tripAttendanceData = tA //returns an array of people attending
      tripCreator.then((tC)=>{
        let tripCreatorData = tC //returns trip creator as object
        // res.json(tripCreatorData)
        const isAttending = !!tripAttendanceData.find(attendee => attendee.id === user.id)
        res.render('tripGeneral', {
          isAttending: isAttending,
          tripData: tripDataData,
          tripAttendance: tripAttendanceData,
          tripCreator: tripCreatorData,
          user: user
        })
      })
    })
  })
})

router.get('/userProfiles/:userId', (req,res,next) => {
  let userId = req.params.userId
  let userDataQuery = `
    select *
    from users
    where id = $1`
  let userTripsQuery = `
    select trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
    from trips, users, attendance
    where trips.creator_id = users.id and users.id = $1
    or trips.id = attendance.trip_id and attendance.user_id = users.id and users.id = $1
    group by trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
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
          if (userTripsData[0]){
            res.render('userGeneral', {
              userData: userDataData,
              userTrips: userTripsData,
              userTripsCreated: userTripsCreatedData,
              userTripsAttended: userTripsAttendedData
            })
     
        } else {
            res.render('newProfile', {
            userData: userDataData,
            userTripsCreated: userTripsCreatedData,
            userTripsAttended: userTripsAttendedData
          })
          }
        })
      })
    })

  })
  // res.render('userGeneral');  
  //
});

router.get('/myProfile', (req,res,next) => {
  let userId = req.session.userObject.id
  console.log(userId);
  let userDataQuery = `
    select *
    from users
    where id = $1`
  let creatorTripsQuery = `
  select trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
    from trips, users
    where trips.creator_id = users.id and users.id = $1`
  let userTripsQuery = `
    select trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
    from trips, users, attendance
    where trips.creator_id = users.id and users.id = $1
    or trips.id = attendance.trip_id and attendance.user_id = users.id and users.id = $1
    group by trips.name, trips.city, trips.country, trips.start_date, trips.end_date, trips.description, trips.id, trips.picture
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
  let creatorTrips = db.any(creatorTripsQuery, [userId])
  userData.then((udt) => {
    let userDataData = udt[0]
    userTripsCreated.then((utcd)=>{
      let userTripsCreatedData = utcd[0]
      userTripsAttended.then((utad)=>{
        let userTripsAttendedData = utad[0]
        if (userTripsCreatedData.count != 0 && userTripsAttendedData.count == 0){
          creatorTrips.then((ct) => {
            let creatorTripsData = ct
            res.render('userGeneral', {
              userData: userDataData,
              userTrips: creatorTripsData,
              userTripsCreated: userTripsCreatedData,
              userTripsAttended: userTripsAttendedData,
              myPage: true
            })
          })
        } else {
          userTrips.then((utd)=>{
            let userTripsData = utd
          // res.json(userTripsData)
            if (userTripsCreatedData.count == 0 && userTripsAttendedData.count == 0){
              res.render('newProfile', {
                userId: userId,
                userData: userDataData,
                userTripsCreated: userTripsCreatedData,
                userTripsAttended: userTripsAttendedData,
                myPage: true
              })
            } else {
                res.render('userGeneral', {
                  userId: userId,
                  userData: userDataData,
                  userTrips: userTripsData,
                  userTripsCreated: userTripsCreatedData,
                  userTripsAttended: userTripsAttendedData,
                  myPage: true
                })
            }
          })
        }
      })
    })

  })
});

router.get('/editProfile', (req,res,next) => {
  res.render('editProfile')
});

router.post('/updateProcess', upload.single("profile_pic"), (req,res,next) => {
  const newPath = `public/images/profilePics/${req.file.originalname}`;
  fs.rename(req.file.path, newPath, (err)=>{
    if(err) throw error;
  })
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone = req.body.phone_number;
  const password = req.body.password;
  const picture = `/images/profilePics/${req.file.originalname}`
  const checkUserExistsQuery = `
  SELECT * FROM users WHERE email=$1
  `
  db.any(checkUserExistsQuery,[email])
    .then((results) => {
      if(results.length < 0){
        res.redirect('/?msg=userdoesntexist')
      } else {
        updateUser()
      }
    })

  function updateUser(){
    const updateUserQuery = `
    UPDATE users
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      phone = $4,
      password = $5,
      picture = $6
    WHERE id= $7
      returning id  
    `
    const hash = bcrypt.hashSync(password,10)
    console.log(hash)
    db.one(updateUserQuery,[first_name,last_name,email,phone,hash,picture,req.session.userObject.id])
    .then((resp)=>{
      res.redirect('myProfile')
    }).catch((err)=>{
      res.json(err)
    })
  }//end of updateUser function
})//end of updateProcess

router.post('/tripJoin/:tripId', (req,res,next) => {
  const tripId = req.params.tripId;
  const userId = req.session.userObject.id
  const createAttendanceQuery = `
  INSERT INTO attendance
    (user_id, trip_id)
  VALUES
    ($1,$2)
    returning id;
  `
  let createAttendance = db.one(createAttendanceQuery,[userId, tripId])

  createAttendance.then(() => {
    res.redirect('/users/mytrips')
  })
});

router.get('/tripEdit/:tripId', (req,res,next) => {
  res.render('tripEdit', {
    tripId: req.params.tripId
  });
});

router.post('/tripEdit/:tripId/', upload.single("trip_img"), (req,res,next) => {
  const newPath = `public/images/userImages/${req.file.originalname}`;
  fs.rename(req.file.path, newPath, (err)=>{
    if(err) throw error;
  })
  const tripId = req.params.tripId
  console.log(`hello ${tripId}`);
  const picture = `/images/userImages/${req.file.originalname}`
  const name = req.body.name;
  const email = req.body.email;
  const city = req.body.city;
  const country = req.body.country;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const creator_id = req.session.userObject.id;
  const description = req.body.description;  
  const editTripQuery = `
  Update trips
  Set name = $1, city = $2, country = $3, start_date =$4, end_date =$5, creator_id = $6, description = $7, picture = $8
  Where id = $9
    returning id
  `
  const editTrip = db.one(editTripQuery,[name, city, country, start_date, end_date, creator_id, description, picture, tripId ])
  editTrip.then((resp)=>{
        res.redirect('/users/myProfile')
      })
});

module.exports = router;
