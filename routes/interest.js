var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');



require('../models/interest');
const Interest=mongoose.model('interests');



//fetch all interest for user
router.get('/index/:id',ensureAuthenticated,(req,res)=>{
  Interest.find({})
  .sort({date:'desc'})
  .then(interests=>{
    res.render('interest/index',{
    interests:interests
  });
 });
});
module.exports =router;
