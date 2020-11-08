const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();


// Index route - show all entries for the user
router.get('/',isLoggedIn,async (req,res)=>{
  const user = await db.user.findByPk(req.session.passport.user)
  const entries = await user.getEntries()
  res.render('journal/index',{entries})
})

// new route - display new entry page
router.get('/new',isLoggedIn,(req,res)=>{
  res.render('journal/new',{today: new Date().toLocaleDateString('en-CA')})
})


// create route
router.post('/',isLoggedIn, async (req,res)=>{
  //console.log(req.body.text);
  const dateToUse = new Date(req.body.date)
  const retrogradeRes = await axios.get('https://mercuryretrogradeapi.com?date='+req.body.date)
  retrograde = retrogradeRes.data.is_retrograde;
  const score = sentiment.analyze(req.body.text).score
  const moonURL = `https://www.icalendar37.net/lunar/api/?month=${dateToUse.getUTCMonth()+1}&year=${dateToUse.getUTCFullYear()}`
  const moonRes = await axios.get(moonURL)
  console.log(moonRes.data.phase[dateToUse.getUTCDate()])
  const image = moonRes.data.phase[dateToUse.getUTCDate()].svg;
  const phaseName = moonRes.data.phase[dateToUse.getUTCDate()].phaseName;
  const createdEntry = await db.entry.create({ //do i want to allow multiple entries for a date? I think so.
      date: req.body.date,
      text: req.body.text,
      score: score,
      userId: req.session.passport.user,
      phase: phaseName,
      phaseimg: image,
      retrograde: retrograde
  })
    console.log(createdEntry);
    res.redirect('/journal')
})

module.exports = router;
