var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/loan');
const Loan=mongoose.model('loan');

require('../models/commonaccount');
const Common=mongoose.model('common');

require('../models/user');
const User=mongoose.model('users');

require('../models/pay');
const Pay=mongoose.model('pay');

router.get('/payment',ensureAuthenticated, function(req, res, next) {
  res.render('pay/payment', { title: 'banking' });
});

router.post('/payment/:id',ensureAuthenticated,  (req, res) => {
  let errors=[];
  if(!req.body.fname){
    errors.push({text:'please enter your name'});
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
  if(req.body.amount < 1){
    errors.push({text:'invalid amount'});
  }
  if(errors.length>0){
    res.render('users/index',{
      errors:errors,
      fname:req.body.fname,
      email:req.body.email,
      phone:req.body.phone,
      amount:req.body.amount
    })
}else {
  if(req.user.loanamount<1){
  req.flash('error_msg','please you have no existing loan');
  res.redirect('/users/index');
}else{
  if(req.body.amount > req.user.loanamount){
    req.flash('error_msg','please enter the exact amount');
    res.redirect('/pay/payment');
  }  else{
      const newPayment = {
        fname: req.body.fname,
        email: req.body.email,
        phone:req.body.phone,
        amount:req.body.amount,
        user: req.user.id
    }
      new Pay(newPayment)
      .save()

  User.update({_id:req.user.id},{
      loanamount:new Number(req.user.loanamount) - new Number(req.body.amount)
    },function(err){
      if(err){
        console.log(err);
      }
      req.flash('success_msg','loan Payment made successful ');
      res.redirect('/users/index');
    });
    }
  }
}



});

// display loan payment reports
router.get('/index/:id', ensureAuthenticated, (req, res) => {
  Pay.find({user: req.user.id})
    .sort({date:'desc'})
    .then(pay => {
      res.render('pay/index', {
        pay:pay
      });
    });
});


module.exports=router;
