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

module.exports = router;
