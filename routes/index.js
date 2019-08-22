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

router.get('/about', (res,req,next) => {
  //
});




module.exports = router;
