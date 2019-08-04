//
// const express=require('express');
// const router=express.Router();
//
// //const paypal_keys = require('./config/paypal_keys;
// const stripe = require('stripe')('sk_test_Zf9KxLlBgYdqjlDIkniIzGJF'/*(keys.stripeSecretKey)*/);
//
// // Charge Route
// router.post('/charge', (req, res) => {
//   const amount = 500;
//   stripe.customers.create({
//     email: req.body.stripeEmail,
//     source: req.body.stripeToken
//   })
//   .then(customer => stripe.charges.create({
//     amount,
//     description: 'Account creation table-banking',
//     currency: 'usd',
//     customer: customer.id
//   }))
//   .then(charge => res.render('users/index'));
// });
//
//
// module.exports=router;
