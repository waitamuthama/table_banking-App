var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser');
var logger = require('morgan');
const exphbs=require('express-handlebars');
var bcrypt=require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const multer=require('multer');
const upload=multer({dest:'/uploads'});

//const paypal_keys = require('./config/paypal_keys');
const stripe = require('stripe')('sk_test_Zf9KxLlBgYdqjlDIkniIzGJF'/*(keys.stripeSecretKey)*/);


var indexRouter = require('./routes/index');
var usersRouter=require('./routes/users');
var accountRouter=require('./routes/account');
var depositRouter=require('./routes/deposit');
var loanRouter=require('./routes/loan');
var payRouter=require('./routes/pay');
//var paypalRouter=require('./routes/paypal');
var adminRouter=require('./routes/admin');
var auth=require('./routes/auth');
var interestRouter=require('./routes/interest');
const mongoose=require('mongoose');

var app = express();

//Db config
//const db = require('./config/database');

// connect to mongo db
mongoose.connect('mongodb://localhost/table_banking',{ useNewUrlParser: true });

// setting middleware for handlebars
app.engine('handlebars',exphbs({defaultLayout:'main'}));

app.set('view engine', 'handlebars');

// Passport Config
require('./passport/passport-local')(passport);
require('./passport/passport-google')(passport);

//load keys
const keys=require('./config/keys');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware for flash
app.use(flash());


// declare global variables
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/account',accountRouter);
app.use('/deposit',depositRouter);
app.use('/loan',loanRouter);
app.use('/pay',payRouter);
//app.use('./paypal',paypalRouter);
app.use('/admin',adminRouter);
app.use('/auth',auth);
app.use('/interest',interestRouter);




// Charge Route for paypal implementation
require('./models/account');
const Account= mongoose.model('accounts');

app.post('/charge', (req, res) => {
  const amount = 500;
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Table baking system',
    currency: 'usd',
    customer: customer.id
  }))

.then(charge => res.render('users/index'));
});









const port = process.env.PORT || 3000;
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
module.exports = app;
