const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios');
const sentiment = require('sentiment');

// Index route - show all entries for the user
router.get('/',isLoggedIn,(req,res)=>{
  res.render('journal/index')
})

// new route - display new entry page
router.get('/new',isLoggedIn,(req,res)=>{
  res.render('journal/new')
})

module.exports = router;
