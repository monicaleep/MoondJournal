const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

// get the profile page
router.get('/',isLoggedIn,async (req,res)=>{
  const usersEntries = await db.entry.findAll({
    where: {userId:req.user.id}
  })
  const totalScore = usersEntries.reduce((acc,cv)=>{
    return acc + cv.score
  }, 0);
  let averageScore = totalScore !== 0 ? (totalScore/usersEntries.length).toFixed(2) : 0;
  res.render('profile',{happiness: averageScore, totalEntries: usersEntries.length})
})

// Delete route to delete user's profile
router.delete('/:userid', isLoggedIn, async (req,res)=>{
  try{
    if (req.user.id == req.params.userid){
      await db.user.destroy({
        where: {id: req.user.id}
      });
      req.flash('success', 'account deleted');
      res.redirect('/')
    } else{
      res.redirect('/')
    }
  } catch(err){
    console.log(err);
    res.redirect('/')
  }
})


module.exports = router;
