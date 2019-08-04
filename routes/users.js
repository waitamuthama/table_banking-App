var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const multer=require('multer');
const upload=multer({dest:'./public/images/uploads'});

require('../models/user');
const User=mongoose.model('users');

require('../models/interest');
const Interest=mongoose.model('interests');

require('../models/deposit');
const Deposit=mongoose.model('deposits');

require('../models/comment');
const Comment=mongoose.model('comments');


require('../models/admin');
const Admin=mongoose.model('openregistration');

// router.get('/claiminterest/:id',ensureAuthenticated, function(req, res, next) {
//  res.render('users/claiminterest', { title: ' Table banking' });
// });

  router.get('/index', ensureAuthenticated, (req, res) => {
    User.findOne({_id:req.user.id})
      .then(users => {
        res.render('users/index', {
          users:users
        });
      });
  });


router.get('/',ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: ' Table banking' });
});

// router.get('/profile',ensureAuthenticated, function(req, res, next) {
//   res.render('users/profile', { title: ' Table banking' });
// });

router.get('/register', function(req, res, next) {
  res.render('users/register', { title: ' Table banking' });
});

router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Table banking' });
});

router.get('/createAccount', function(req, res, next) {
  res.render('users/createAccount', { title: 'Table banking' });
});

router.get('/index', function(req, res) {
  res.render('interest/index', { title: 'Table banking' });
});

// //admin auth
function requireAdmin() {
  return function(req, res, next) {
    User.findOne({usertype:'admin'})
    .then(admin=>{
      if(admin){
        res.redirect('/admin/index1')
      }else {
          res.redirect('/users/index')
      }
    })
      // Hand over control to passport
      next();
  }
}


// Login Form POST
router.post('/login', (req, res, next) => {
      passport.authenticate('local', {
        successRedirect:'/users/index',
        failureRedirect: '/',
        failureFlash: true
      })(req, res, next);
});

// User registration
router.post('/register', (req, res) => {

  Admin.findOne({registerModule:'false'})
      .then(register => {
        if(register){
          req.flash('error_msg', 'Please registration passed. Contact admin for more information');
          res.redirect('/');
        }else{
            let errors=[];
            if(!req.body.firstName){
            errors.push({text:'Please FirstName field is empty'});
            }
            if(!req.body.lastName){
            errors.push({text:'Please lastName field is empty'});
            }
            if(!req.body.email){
            errors.push({text:'Please email field is empty'});
            }
            if(req.body.password != req.body.password1){
            errors.push({text:'passwords do not match'});
            }
            if(req.body.password.length < 4){
              errors.push({text:'password must be atleast four characters'});
            }
            if(errors.length > 0){
              res.render('index', {
                errors: errors,
                firstName:req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                password1: req.body.password1

              });
            } else {
              User.findOne({email: req.body.email})
                .then(user => {
                  if(user){
                    req.flash('error_msg', 'Email already regsitered.Try again Please');
                    res.redirect('/');
                  } else {
                    const newUser = new User({
                      firstName:req.body.firstName,
                      lastName: req.body.lastName,
                      email: req.body.email,
                      password: req.body.password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                          .then(user => {
                            req.flash('success_msg', 'You are now registered ');
                            res.redirect('/users/index');
                          })
                          .catch(err => {
                            console.log(err);
                            return;
                          });
                      });
                    });
                  }
                });
            }
        }
      });
   });

//find all users


// load user profile form
// router.get('/profile/:id',function(req,res){
//   User.findOne({_id:req.params.id},function(err,user){
//     if(err){
//     console.log(err);
//     }
//     var model={
//       user:user
//     };
//     res.render('users/profile',model);
//   });
//});

router.get('/profile',ensureAuthenticated,function(req,res){
  User.find({},function(err,users){
    if(err){
      console.log(err);
    }
    var model={
      users:users
    }
    res.render('users/profile',model);
  })
});

// update user profile
router.post('/profile/:id',upload.single('image'),function(req,res){

 if(req.file){
   console.log('Uploading file...');
   var image=req.file.filename;
 }else{

 }

    User.update({_id:req.params.id},{
      image:image,
      location:req.body.location,
      phone:req.body.phone,
      firstName:req.body.fname,
      lastName:req.body.lname,
      email:req.body.email

    },function(err){
      if(err){
        console.log(err);
      }
      req.flash('success_msg',' profile updated sucessfully');
      res.redirect('/users/profile');
    });
});




//claim INTEREST
router.post('/claiminterest/:id',ensureAuthenticated,function(req,res){
  if(req.user.interest<1){
    req.flash('error_msg','Oooops!..you have no interest to claim');
    res.redirect('/users/index');
  }else {
    if(req.user.intereststatus==true){
      User.updateOne({_id:req.params.id},{
        interest:0
      },function(err){
        if(err){
          console.log(err);
        }
      });

      const newInterest = new Interest({
        firstName:req.body.fname,
        email: req.body.email,
        interestamount: req.body.amount,
      })
      .save()
      .then(interest=>{
        req.flash('success_msg','you have claimed your interest successful!! enjoy !!');
        res.redirect('/users/index');
       })
    }
      else{
          req.flash('error_msg','Oooops! you cannot access this service. Contact admin for more information');
          res.redirect('/users/index');
      }

  }


});


router.get('/comments',ensureAuthenticated,(req,res)=>{
  Comment.find({})
  .sort({date:'desc'})
  .then(comment=>{
    res.render('users/comments',{
    comment:comment
  })
  })
});

//post comments
router.post('/comments/:id',upload.single('image'),ensureAuthenticated,function(req,res){
   const newComment ={
     title:req.body.title,
     message:req.body.message,
     firstName:req.user.firstName,
     lastName:req.user.lastName,
     image:req.user.image,
     user:req.user.id
   }
   new Comment(newComment)
   .save()
   .then(comment=>{
     res.redirect('/users/comments');
   });
});

//get comment reply
router.get('/reply/:id',function(req,res){
  res.render('users/comment/reply');
});

//comment reply
router.post('/reply/:id', (req,res) => {
   Comment.findOne({_id:req.params.id})
   .then(reply =>{
     const newReply = {
       replyMessage:req.body.message,
       firstName:req.user.firstName,
       lastName:req.user.lastName
     }
    // Add rooms array
     reply.reply.unshift(newReply);
      reply.save()
      //new Room(newRoom).save()
      .then(reply => {
        res.redirect(`/users/comments`);
      });
   });
});



// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

//fetch all USer



module.exports = router;
