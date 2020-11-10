const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();


// Index route - show all entries for the user
router.get('/',isLoggedIn, async (req,res)=>{
  //console.log(req.user)
  const user = await db.user.findByPk(req.user.id)
  const entries = await user.getEntries({order: [['date','DESC']]})
  res.render('journal/index',{entries})
})

// new route - display new entry page
router.get('/new',isLoggedIn,(req,res)=>{
  res.render('journal/new',{today: new Date().toLocaleDateString('en-CA')})
})

// delete route - deletes a journal entry
router.delete('/:id',isLoggedIn,async (req,res)=>{
  const deleted = await db.entry.destroy({
    where: {id:req.params.id}
  });
  req.flash('success','Deleted entry')
  res.redirect('/journal')
})

// create route
router.post('/',isLoggedIn, async (req,res)=>{
  const dateToUse = new Date(req.body.date)
  const retrogradeRes = await axios.get('https://mercuryretrogradeapi.com?date='+req.body.date)
  const retrograde = retrogradeRes.data.is_retrograde;
  const score = sentiment.analyze(req.body.text).score
  const moonURL = `https://www.icalendar37.net/lunar/api/?month=${dateToUse.getUTCMonth()+1}&year=${dateToUse.getUTCFullYear()}`
  const moonRes = await axios.get(moonURL)
  const image = moonRes.data.phase[dateToUse.getUTCDate()].svg;
  const phaseName = moonRes.data.phase[dateToUse.getUTCDate()].phaseName;
  const createdEntry = await db.entry.create({ //do i want to allow multiple entries for a date? I think so.
      date: req.body.date,
      text: req.body.text,
      score: score,
      userId: req.user.id,
      phase: phaseName,
      phaseimg: image,
      retrograde: retrograde
  })
    console.log(createdEntry);
    res.redirect('/journal')
})

// update route - put the changes into the database
router.put('/:id',isLoggedIn, async(req,res)=>{
  const foundEntry = await db.entry.findByPk(req.params.id);
  const score = sentiment.analyze(req.body.text).score;
  // update score and text fields of the entry
  foundEntry.text = req.body.text;
  foundEntry.score = score;
  //if the date has changed, need to make api calls
  if(foundEntry.date !== req.body.date){
    const dateToUse = new Date(req.body.date)
    const retrogradeRes = await axios.get('https://mercuryretrogradeapi.com?date='+req.body.date)
    retrograde = retrogradeRes.data.is_retrograde;
    const moonURL = `https://www.icalendar37.net/lunar/api/?month=${dateToUse.getUTCMonth()+1}&year=${dateToUse.getUTCFullYear()}`
    const moonRes = await axios.get(moonURL)
    const image = moonRes.data.phase[dateToUse.getUTCDate()].svg;
    const phaseName = moonRes.data.phase[dateToUse.getUTCDate()].phaseName;
    // update fields of the entry
    foundEntry.retrograde = retrograde;
    foundEntry.phase = phaseName;
    foundEntry.phaseimg = image;
    foundEntry.date = req.body.date;
  }
  updatedEntry = await foundEntry.save();
  res.redirect('/journal')
})

// edit route - edit an Entry
router.get('/:id/edit',isLoggedIn, async (req,res)=>{
  // need to check if user is the owner
  try{
    const entryToEdit = await db.entry.findByPk(req.params.id)
    if(entryToEdit.userId === req.user.id){
      res.render('journal/edit',{entry:entryToEdit})
    } else {
      req.flash('error',`You don't have permission to edit that entry`);
      res.redirect('/journal')
    }
  } catch(err){
    req.flash('error','Entry not found')
    res.redirect('/journal')
  }

})

// show route - show more details of an entry
router.get('/:id',isLoggedIn, async (req,res)=>{
  const entry = await db.entry.findByPk(req.params.id)
  if(entry.userId === req.user.id){
    res.render('journal/show',{entry})

  } else{
    req.flash('error','That is a private journal entry, try to view one that you wrote')
    res.redirect('/journal')
  }
})
module.exports = router;
