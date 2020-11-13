const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios');
const Sentiment = require('sentiment'); // npm package to calculate 'sentiment' of user's entries
const sentiment = new Sentiment();


// Index route - show all entries for the user
router.get('/', isLoggedIn, async (req, res) => {
  const user = await db.user.findByPk(req.user.id)
  const entries = await user.getEntries({
    order: [
      ['date', 'DESC']
    ]
  })
  res.render('entry/index', {
    entries
  })
})


// new route - display new entry page
router.get('/new', isLoggedIn, (req, res) => {
  res.render('entry/new', {
    today: new Date().toLocaleDateString('en-CA')
  })
})


// delete route - deletes a entry entry
router.delete('/:id', isLoggedIn, async (req, res) => {
  const deleted = await db.entry.destroy({
    where: {
      id: req.params.id
    }
  });
  req.flash('success', 'Deleted entry')
  res.redirect('/entry')
})


// create route
router.post('/', isLoggedIn, async (req, res) => {
  const dateToUse = new Date(req.body.date)
  // API call to retrograde API
  const retrogradeRes = await axios.get('https://mercuryretrogradeapi.com?date=' + req.body.date)
  const retrograde = retrogradeRes.data.is_retrograde;
  const score = sentiment.analyze(req.body.text).score
  // API call to get moon phase and image
  const moonURL = `https://www.icalendar37.net/lunar/api/?month=${dateToUse.getUTCMonth()+1}&year=${dateToUse.getUTCFullYear()}`
  const moonRes = await axios.get(moonURL)
  const image = moonRes.data.phase[dateToUse.getUTCDate()].svg;
  const phaseName = moonRes.data.phase[dateToUse.getUTCDate()].phaseName;
  // create the entry in the database
  const createdEntry = await db.entry.create({
    date: req.body.date,
    text: req.body.text,
    score: score,
    userId: req.user.id,
    phase: phaseName,
    phaseimg: image,
    retrograde: retrograde
  })
  res.redirect('/entry')
})


// update route - put the changes into the database
router.put('/:id', isLoggedIn, async (req, res) => {
  const foundEntry = await db.entry.findByPk(req.params.id);
  const score = sentiment.analyze(req.body.text).score;
  // update score and text fields of the entry
  foundEntry.text = req.body.text;
  foundEntry.score = score;
  //if the date has changed, need to make api calls
  if (foundEntry.date !== req.body.date) {
    const dateToUse = new Date(req.body.date)
    // api call to mercury retrograde
    const retrogradeRes = await axios.get('https://mercuryretrogradeapi.com?date=' + req.body.date)
    retrograde = retrogradeRes.data.is_retrograde;
    // api call to get moon phase and image
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
  res.redirect('/entry')
})

// edit route - edit an Entry
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  // need to check if user is the owner
  try {
    const entryToEdit = await db.entry.findByPk(req.params.id)
    if (entryToEdit.userId === req.user.id) {
      res.render('entry/edit', {
        entry: entryToEdit
      })
    } else {
      req.flash('error', `You don't have permission to edit that entry`);
      res.redirect('/entry')
    }
  } catch (err) {
    req.flash('error', 'Entry not found')
    res.redirect('/entry')
  }
})


// show route - show more details of an entry
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const entry = await db.entry.findByPk(req.params.id)
    if (entry.userId === req.user.id) {
      res.render('entry/show', {
        entry
      })
    } else {
      req.flash('error', 'That is a private entry, try to view one that you wrote')
      res.redirect('/entry')
    }
  } catch (err) {
    res.render('404')
  }
})

module.exports = router;