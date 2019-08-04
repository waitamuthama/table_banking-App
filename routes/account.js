var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/user');
const User=mongoose.model('users');

require('../models/account');
const Account=mongoose.model('accounts');

require('../models/commonaccount');
const Common=mongoose.model('common');

router.get('/create',ensureAuthenticated, function(req, res, next) {
  res.render('account/create', { title: 'banking' });
});

router.post('/create',ensureAuthenticated , (req, res) => {
    let errors=[];
    if(!req.body.fname){
      errors.push({text:'please entre your name'});
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
    if(req.body.amount <500){
      errors.push({text:' Please minimum amount to create account is 500'});
    }
    if(req.body.amount >500){
      errors.push({text:' Please only 500 ksh atmost required'});
    }

    if(errors.length>0){
      res.render('account/create',{
        errors:errors,
        fname:req.body.fname,
        email:req.body.email,
        phone:req.body.phone,
        amount:req.body.amount

      });
    }else {
        Account.findOne({email:req.body.email})
        .then(account=>{
          if(account){
              req.flash('error_msg', 'Email already created account');
              res.redirect('/account/create');
          }else{
            const newAccount={
              name:req.body.fname,
              email:req.body.email,
              phone:req.body.phone,
              amount:req.body.amount,
              user:req.user.id
            }

            new Account(newAccount)
            .save()

            // update common ACC
            const newCommon={
              amount:req.body.amount
            }
            new Common(newCommon)
            .save()

              User.update({_id:req.user.id},{
                amount:req.body.amount},function(err){
                  if (err) {
                    console.log(err);
                  }
                })
              .then(acc => {
               req.flash('success_msg', 'account created successful');
               res.redirect('/users/index');
             })

            // .save()
            // .then(acc => {
            //   req.flash('success_msg', 'account created successful');
            //   res.redirect('/users/index');
            // })
          }
        })
     }

});

module.exports = router;
