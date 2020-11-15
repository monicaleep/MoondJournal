const express = require('express');
const router = express.Router();
const db = require('../models')
const passport = require('../config/ppConfig');


router.get('/signup',(req,res)=>{
  res.render('auth/signup')
})


router.post('/signup',(req,res)=>{
  db.user.findOrCreate({
    where : {email: req.body.email},
    defaults: {name: req.body.name, password: req.body.password}
  })
  .then(([createdUser,created])=>{
    if(!created){  //if the user was not created cos email already exists
      req.flash('error','A user associated with that email already exists, try logging in')
      res.redirect('/auth/login') // redirect to login page
    } else{
      passport.authenticate('local',{
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req,res) //IIFE
    }
  })
  .catch(err=>{
    req.flash('error',err.message)
    res.redirect('/auth/signup')
  })
})


router.get('/login',(req,res)=>{
  res.render('auth/login')
});


router.post('/login', passport.authenticate('local',{
  failureRedirect: '/auth/login',
  successRedirect: '/',
  failureFlash: 'Invalid email or password, try again',
  successFlash: 'You have successfully logged in'
}))


router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success','You are now logged out!')
  res.redirect('/')
})

module.exports = router;
