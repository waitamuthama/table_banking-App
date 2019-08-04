var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/deposit');
const Deposit=mongoose.model('deposits');

require('../models/commonaccount');
const Common=mongoose.model('common');

require('../models/user');
const User=mongoose.model('users');


router.get('/make',ensureAuthenticated, function(req, res, next) {
  res.render('deposit/make', { title: 'banking' });
});


router.post('/make/:id',ensureAuthenticated,  (req, res) => {
  let errors=[];
  if(!req.body.fname){
    errors.push({text:'Name field is empty'});
  }
  if(!req.body.email){
    errors.push({text:'please enter your email'});
  }
  if(!req.body.phone){
    errors.push({text:'phone field is empty'});
  }
  if(!req.body.amount){
    errors.push({text:'please input amount'});
  }
  if(req.body.amount<1){
    errors.push({text:'invalid deposit amount'});
  }

  if(errors.length>0){
    res.render('deposit/make',{
      errors:errors,
      fname:req.body.fname,
      email:req.body.email,
      phone:req.body.phone,
      amount:req.body.amount
    });
  }else{

    const newDeposit = {
      fname: req.body.fname,
      email: req.body.email,
      phone:req.body.phone,
      amount:req.body.amount,
      user: req.user.id
  }
new Deposit(newDeposit)
.save()

const newCommon={
  amount:req.body.amount
}
new Common(newCommon)
.save()
.then(deposit => {
  req.flash('success_msg', 'Deposit made successfully');
  res.redirect('/users/index');
});
  }
});



router.get('/index', ensureAuthenticated, (req, res) => {
  Deposit.find({user: req.user.id})
    .sort({date:'desc'})
    .then(deposits => {
      res.render('deposit/index', {
        deposits:deposits
      });
    });
});





module.exports=router;
