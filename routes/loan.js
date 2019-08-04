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

require('../models/admin');
const Admin=mongoose.model('openregistration');


router.get('/request',ensureAuthenticated, function(req, res, next) {
  res.render('loan/request', { title: 'banking' });
});

router.post('/request/:id',ensureAuthenticated,  (req, res) => {
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
    errors.push({text:'Invalid amount'});
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
     Admin.findOne({loanreqsModule:'false'})
     .then(loan=>{
       if(loan){
         req.flash('error_msg', 'Please you cant access loan service at this time. Contact admin for more information');
         res.redirect('/users/index');
       }else {
           if(req.user.amount != 500){
             req.flash('error_msg','create account to access this service');
             res.redirect('/users/index');
           }else {
             if(req.user.status==false){
               req.flash('error_msg','Please you cant access this service.Contact admin for more information');
               res.redirect('/users/index');
             }else {
               if(req.user.loanamount > 0){
                 req.flash('error_msg','please you have an existing loan.Pay now to request another loan');
                 res.redirect('/users/index');
               }else{
                 const newLoan = {
                   fname: req.body.fname,
                   email: req.body.email,
                   phone:req.body.phone,
                   amount:req.body.amount,
                   user: req.user.id
               }
                 new Loan(newLoan)
                 .save()
                 if(req.user.interest == 100){
                   User.findOne({_id:req.params.id})
                   .then(issue=>{
                     const newIssue ={
                       amount: new Number(req.body.amount) + 500
                     }
                     // add amount to issue array
                     issue.issue.unshift(newIssue);
                     issue.save()
                     .then(issue=>{
                       req.flash('success_msg','loan request made successful ');
                       res.redirect('/users/index');
                     })
                   })

                   User.updateOne({_id:req.user.id},{
                     loanamount:new Number(req.body.amount) + new Number(req.user.loanamount)+new Number(req.body.amount*10/100),
                     interest:req.body.amount*10/100 + req.user.interest,
                     // issue.amount: 500 + new Number(req.user.issue)
                     },function(err){
                       if(err){
                         console.log(err);
                       }
                     })
                   //)
                 }
                 else if(req.user.interest >=500 && req.user.interest <600){
                     User.findOne({_id:req.params.id})
                     .then(issue=>{
                       const newIssue ={
                         amount: new Number(req.body.amount) + 500
                       }
                       // add amount to issue array
                       issue.issue.unshift(newIssue);
                       issue.save()
                       .then(issue=>{
                         req.flash('success_msg','loan request made successful ');
                         res.redirect('/users/index');
                       })
                     })

                     User.updateOne({_id:req.user.id},{
                       loanamount:new Number(req.body.amount) + new Number(req.user.loanamount)+new Number(req.body.amount*10/100),
                       interest:req.body.amount*10/100 + req.user.interest,
                       //issue: 500 + new Number(req.user.issue)
                       },function(err){
                         if(err){
                           console.log(err);
                         }
                         // req.flash('success_msg','loan request made successful ');
                         // res.redirect('/users/index');
                       })
                   }
                   else if(req.user.interest ==1000){
                       User.findOne({_id:req.params.id})
                       .then(issue=>{
                         const newIssue ={
                           amount: new Number(req.body.amount) + 500
                         }
                         // add amount to issue array
                         issue.issue.unshift(newIssue);
                         issue.save()
                         .then(issue=>{
                           req.flash('success_msg','loan request made successful ');
                           res.redirect('/users/index');
                         })
                       })
                       User.updateOne({_id:req.user.id},{
                       loanamount:new Number(req.body.amount) + new Number(req.user.loanamount)+new Number(req.body.amount*10/100),
                       interest:req.body.amount*10/100 + req.user.interest,
                       issue: 500 + new Number(req.user.issue)
                       },function(err){
                         if(err){
                           console.log(err);
                         }
                         // req.flash('success_msg','loan request made successful ');
                         // res.redirect('/users/index');
                       })
                     }
                   else {
                       User.updateOne({_id:req.user.id},{
                       loanamount:new Number(req.body.amount) + new Number(req.user.loanamount)+new Number(req.body.amount*10/100),
                       interest:req.body.amount*10/100 + req.user.interest
                    },function(err){
                      if(err){
                        console.log(err);
                      }
                       req.flash('success_msg','loan request made successful ');
                       res.redirect('/users/index');
                    })
                      }
                     }
                   }


            //    if(req.user.interest >=100){
            //      User.updateOne({_id:req.user.id},{
            //      issue: 500 + new Number(req.user.issue)
            //   },function(err){
            //     if(err){
            //       console.log(err);
            //     }
            //     req.flash('success_msg','loan request made successful ');
            //     res.redirect('/users/index');
            //   })
            // }
             }
           }
     })

  }

 });

//loan request reports
router.get('/index/:id',ensureAuthenticated,(req,res)=>{
  Loan.find({user:req.user.id})
  .sort({date:'desc'})
  .then(loan=>{
    res.render('loan/index',{
    loan:loan
  })
  })
});

module.exports=router;
