 const express=require('express');
 const router=express.Router();
 const passport=require('passport');

// google login
router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
  }));
  
  router.get('/google',(req,res)=>{
  res.send('auth');

  });
  router.get('/google/callback',
   passport.authenticate('google',{
     failureRedirect:'/users/login'
   }),
   function(req,res){
    // success authenticate home
    res.render('users/index');
   }
  );
  
  //google verify
  router.get('/verify',(req,res)=>{
    if(req.user){
     console.log(req.user);
    }else{
      console.log('Not Auth');
    }
  });

  module.exports=router;
  