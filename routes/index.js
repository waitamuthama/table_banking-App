var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose=require('mongoose');

require('../models/user');
const User=mongoose.model('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'banking' });
});


// // Login Form POST
// router.post('/', (req, res,next) => {
//   passport.authenticate('local', {
//     successRedirect:'/users/index',
//     failureRedirect: '/',
//     failureFlash: true
//   })(req, res, next);
// });


module.exports = router;
