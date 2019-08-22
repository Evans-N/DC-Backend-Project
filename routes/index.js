var express = require('express');
var router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', (res,req,next) => {
 //THIS IS OUR LOGIN PAGE
});

router.post('/loginProcess',(req,res) => {
  const checkUserQuery = `
  SELECT * FROM users WHERE username=$1
  `
  const checkUser = db.one(checkUserQuery,[req.body.username])
  checkUser.then((results)=>{
      const correctPass = bcrypt.compareSync(req.body.password,results.password)
      if(correctPass){
        //this is a valid user pass
        req.session.username = results.username;
        req.session.loggedin = true;
        req.session.email = results.email;
        res.redirect('/')
      } else {
        res.redirect('/login?msg=badPass')
      }
      res.json(results);
    })
  checkUser.catch((err)=>{
    res.json({
      msg: "userDoesNotExist"
    })
  })
})

router.get('/about', (res,req,next) => {
  res.render('about'); 
});




module.exports = router;
