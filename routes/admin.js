                  var express = require('express');
                  var router = express.Router();
                  const mongoose=require('mongoose');
                  const {ensureAuthenticated} = require('../helpers/auth');
                  require('../models/deposit');
                  const Deposit=mongoose.model('deposits');

                  require('../models/commonaccount');
                  const Common=mongoose.model('common');

                  require('../models/loan');
                  const Loan=mongoose.model('loan');

                  require('../models/pay');
                  const Pay=mongoose.model('pay');

                  require('../models/user');
                  const User=mongoose.model('users');

                  require('../models/admin');
                  const Admin=mongoose.model('openregistration');

                  // router.get('/index1',function(req, res, next) {
                  //   res.render('admin/index1', { title: 'banking' });
                  // });

                  // router.get('/index',function(req, res, next) {
                  //   res.render('admin/index', { title: 'banking' });
                  // });

                  // router.get('/members',function(req, res, next) {
                  //   res.render('admin/members', { title: 'banking' });
                  // });

                  router.get('/interestclaims',function(req, res, next) {
                    res.render('admin/interestclaims', { title: 'banking' });
                  });

                  router.get('/interestclaims/disable',function(req, res, next) {
                    res.render('admin/interestclaims', { title: 'banking' });
                  });

                  //Members
                  router.get('/index1',function(req,res){
                    User.find({status:'true'},function(err,members){
                      if(err){
                        console.log(err);
                      }
                      var model={
                        members:members
                      }
                      res.render('admin/index1',model);
                    });
                  });

                  //deposits
                  router.get('/deposits',function(req,res){
                    Deposit.find({},function(err,deposits){
                      if(err){
                        console.log(err);
                      }
                      var model={
                        deposits:deposits
                      }
                      res.render('admin/deposits',model);
                    });
                  });

                  //loan
                  router.get('/loanreqs',function(req,res){
                    Loan.find({},function(err,loanreqs){
                      if(err){
                        console.log(err);
                      }
                      var model={
                        loanreqs:loanreqs
                      }
                      res.render('admin/loanreqs',model);
                    });
                  });

                  //pay
                  router.get('/pay',function(req,res){
                    Pay.find({},function(err,pay){
                      if(err){
                        console.log(err);
                      }
                      var model={
                        pay:pay
                      }
                      res.render('admin/pay',model);
                    });
                  });

                  //load edit Form
                  router.get('/edit/:id',function(req,res){
                    User.findOne({_id:req.params.id},function(err,user){
                      if(err){
                        console.log(err);
                      }
                      var model={
                        user:user
                      }
                      res.render('admin/edit',model);
                    });
                  });

                  // post user edit for
                  router.post('/edit/:id',function(req,res){
                      User.updateOne({_id:req.params.id},{
                        firstName:req.body.fname,
                        email:req.body.email,
                        phone:req.body.phone,
                        location:req.body.location
                      },function(err){
                        if(err){
                          console.log(err);
                        }
                        req.flash('success_msg','member data updated sucessfully');
                        res.redirect('/admin/index1');
                      });
                    });

                  // Delete member
                  router.delete('/:id', (req, res) => {
                    User.remove({_id: req.params.id})
                      .then(() => {
                        req.flash('success_msg', 'member deleted successfully');
                        res.redirect('/admin/index1');
                      });
                  });

                  //load blacklist
                  router.get('/blacklist/:id',function(req,res){
                      res.render('admin/blacklist');
                  });

                  // black list member
                  router.post('/blacklist/:id',function(req,res){
                      User.update({_id:req.params.id},{
                        status:false
                      },function(err){
                        if(err){
                          console.log(err);
                        }
                        req.flash('success_msg','member blacklisted');
                        res.redirect('/admin/index1');
                      })
                  });

                  //load unblacklist
                  router.get('/unblacklist/:id',function(req,res){
                      res.render('admin/blacklist');
                  });

                  // unblacklist member
                  router.post('/unblacklist/:id',function(req,res){
                      User.update({_id:req.params.id},{
                        status:true
                      },function(err){
                        if(err){
                          console.log(err);
                        }
                        req.flash('success_msg','member unblacklisted');
                        res.redirect('/admin/index1');
                      })
                  });

                    // display blacklisted members
                    router.get('/blacklistedmembers', function(req,res){
                      User.find({status:'false'},function(err,blacklist){
                         if(err){
                           console.log(err);
                         }
                         var model={
                           blacklist:blacklist
                         }
                         res.render('admin/blacklistedmembers',model);
                      });
                    });


                  //loan pends

                  router.get('/loanpending', function(req,res){
                      User.find({},function(err,pends){
                         if(err){
                           console.log(err);
                         }
                         var model={
                           pends:pends
                         }
                         res.render('admin/loanpending',model);
                      });
                  });


                  // interest Claims activate

                  router.post('/interestclaims',function(req,res){
                    User.updateMany({intereststatus:'false'},{
                      intereststatus:true
                    },function(err){
                      if(err){
                        console.log(err);
                      }
                      req.flash('success_msg','successful! interest claims Allowed ');
                      res.redirect('/admin/index1');
                    });
                  });

                  //interest claims disable
                  router.post('/interestclaims/disable',function(req,res){
                    User.updateMany({intereststatus:'true'},{
                      intereststatus:false
                    },function(err){
                      if(err){
                        console.log(err);
                      }
                      req.flash('success_msg','successful! interest claims disabled');
                      res.redirect('/admin/index1');
                    });
                  });


                  //Open Registration Module
                  router.get('/RegistrationModule/open',function(req,res){
                    res.render('admin/RegistrationModule/open');
                  });

                  //close Registration module
                  router.get('/RegistrationModule/close',function(req,res){
                    res.render('admin/RegistrationModule/close');
                  });

                 //  // post open Registration Module
                 //  router.post('/RegistrationModule/open',function(req,res){
                 // Admin.findOne({registerModule:'false'})
                 // .then(register=>{
                 //   if(register){
                 //     Admin.update({registerModule:'false'},{
                 //      registerModule:true
                 //     },function(err){
                 //       if (err) {
                 //         console.log(err);
                 //       }
                 //       req.flash('success_msg','successful! Registration for members allowed');
                 //       res.redirect('/admin/index1');
                 //     });
                 //   }else {
                 //     Admin.update({registerModule:'true'},{
                 //       registerModule:false
                 //     },function(err){
                 //       if (err) {
                 //         console.log(err);
                 //       }
                 //       req.flash('success_msg','successful! Registration for members closed');
                 //       res.redirect('/admin/index1');
                 //     });
                 //   }
                 // })
                  // Admin.update({registerModule:'false'},{
                  //   registerModule:true
                  // },function(err){
                  //   if (err) {
                  //     console.log(err);
                  //   }
                  //   req.flash('success_msg','successful! Registration for members allowed');
                  //   res.redirect('/admin/index1');
                  // });
                  //});


                  // post disable Registration Module
                  router.post('/RegistrationModule/close',function(req,res){
                  Admin.update({registerModule:'true'},{
                    registerModule:false
                  },function(err){
                    if (err) {
                      console.log(err);
                    }
                    req.flash('success_msg','successful! Registration closed');
                    res.redirect('/admin/index1');
                  });
                  });

                  // post open Registration Module
                  router.post('/RegistrationModule/open',function(req,res){
                  Admin.update({registerModule:'false'},{
                    registerModule:true
                  },function(err){
                    if (err) {
                      console.log(err);
                    }
                    req.flash('success_msg','Registration for new members opened');
                    res.redirect('/admin/index1');
                  });
                  });

                  router.get('/loanrequests/disable',function(req,res){
                    res.render('admin/loanrequests/disable');
                  });

                  // post open loan Module
                  router.post('/loanrequests/disable',function(req,res){
                  Admin.update({loanreqsModule:'true'},{
                    loanreqsModule:false
                  },function(err){
                    if (err) {
                      console.log(err);
                    }
                    req.flash('success_msg','Loan request disabled');
                    res.redirect('/admin/index1');
                  });
                  });

                  router.get('/loanrequests/open',function(req,res){
                    res.render('admin/loanrequests/open');
                  });

                  // post open loan Module
                  router.post('/loanrequests/open',function(req,res){
                  Admin.update({loanreqsModule:'false'},{
                    loanreqsModule:true
                  },function(err){
                    if (err) {
                      console.log(err);
                    }
                    req.flash('success_msg','Loan requests opened');
                    res.redirect('/admin/index1');
                  });
                  });

                  module.exports=router;
