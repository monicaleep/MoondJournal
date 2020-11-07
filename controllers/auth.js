const express = require('express');
const router = express.Router();
const db = require('../models')
const passport = require('../config/ppConfig');


router.get('/signup',(req,res)=>{
  res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
  //console.log('sign up form user input:',req.body)
  db.user.findOrCreate({
    where : {email: req.body.email},
    defaults: {name: req.body.name, password: req.body.password}
  })
  .then(([createdUser,created])=>{
    if(!created){  //if the user was not created cos email already exists
      req.flash('error','email already exists, try logging in')
      res.redirect('/auth/login')
      //console.log('An account associated with that email already exists. Try logging in.')
    } else{
      //console.log('just created the user',createdUser)
      passport.authenticate('local',{
        successRedirect: '/',
        successFlash: 'Account created and loggied in!'
      })(req,res) //IIFE
    }
    // redirect to login page

  })
  .catch(err=>{
    //console.log(err);
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
  failureFlash: 'Invalid email or password',
  successFlash: 'You are now logged in'
}))

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('You are now logged out!')
  res.redirect('/')
})

module.exports = router;
