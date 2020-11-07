const express = require('express');
const router = express.Router();
const db = require('../models')

router.get('/signup',(req,res)=>{
  res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
  console.log('sign up form user input:',req.body)
  db.user.findOrCreate({
    where : {email: req.body.email},
    defaults: {name: req.body.name, password: req.body.password}
  })
  .then(([createdUser,created])=>{
    if(!created){  //if the user was not created cos email already exists
      console.log('An account associated with that email already exists. Try logging in.')
    } else{
      //console.log('just created the user',createdUser)
    }
    // redirect to login page
    res.redirect('/auth/login')
  })
  .catch(err=>{
    console.log(err);
    res.redirect('/auth/signup')
  })
})

router.get('/login',(req,res)=>{
  res.render('auth/login')
});

router.post('/login',(req,res)=>{
  console.log('posting to auth/login route',req.body);
  res.redirect('/')
})


module.exports = router;
