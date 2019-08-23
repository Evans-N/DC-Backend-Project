var express = require('express');
var router = express.Router();
const request = require('request');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const db = require('../db')


/* GET home page. */
router.get('/', (req,res,next) => {
  res.render('index')
  //THIS IS OUR HOME/REGISTER/LOGIN PAGE
});

router.get('/login', (req,res,next) => {
  res.render('login')
  //THIS IS OUR LOGIN PAGE
});

router.post('/loginProcess',(req,res) => {
  const checkUserQuery = `
  SELECT * FROM users WHERE email=$1
  `
  const checkUser = db.one(checkUserQuery,[req.body.email])
  checkUser.then((results)=>{
      const correctPass = bcrypt.compareSync(req.body.password,results.password)
      if(correctPass){
        console.log('login success')
        console.log(results.email)
        //this is a valid user pass
        // req.session.email = results.email;
        // req.session.loggedin = true;
        // req.session.email = results.email;
        res.redirect('/users/myProfile') //brings the user to their landing page on login 
      } else {
        res.redirect('/login?msg=badPass')
      }
      res.json(results);
    })
  checkUser.catch((err)=>{
    console.log('loginErr')
    console.log(err)
    res.json({
      msg: "userDoesNotExist"
    })
  })
})

//ALLOWS USERS TO REGISTER/POST TO DB
router.post("/registerProcess",(req,res,next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone = req.body.phone_number;
  const password = req.body.password;
  console.log(req.body)
  // const picture = 

  const checkUserExistsQuery = `
  SELECT * FROM users WHERE email=$1
  `
  db.any(checkUserExistsQuery,[email])
    .then((results) => {
      if(results.length > 0){
        res.redirect('/?msg=useralreadyexists')
      } else {
        insertUser()
      }
    })
  // .catch((err) => {
  //   console.log('error registering')
  //   console.log(err)
  //   res.redirect('/')
  // })
  // console.log(checkUser)
  // if(checkUser){
  //   res.redirect('/?msg=userAlreadyExists')
  // } else {
  //   insertUser()
  // }

  function insertUser(){
    const insertUserQuery = `
    INSERT INTO users
      (first_name,last_name,email,phone,password)
    VALUES
      ($1,$2,$3,$4,$5)
      returning id
    `
    const hash = bcrypt.hashSync(password,10)
    db.one(insertUserQuery,[first_name,last_name,email,phone,hash])
    .then((resp)=>{
      res.json({
        msg: "useradded"
      })
      // res.redirect('/login?msg=useradded')
    })
  }//end of insertUser function
})//end of registerProcess

router.get('/about', (req,res,next) => {
  res.render('about')
});




module.exports = router;
