const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/',isLoggedIn,async (req,res)=>{
//  const user = await db.user.findByPk(req.user.id)
  const usersEntries = await db.entry.findAll({
    where: {userId:req.user.id}
  })
  const totalScore = usersEntries.reduce((acc,cv)=>{
    return acc + cv.score
  }, 0);
  const averageScore = totalScore/usersEntries.length;
  //res.send("average score: "+totalScore/usersEntries.length)
  res.render('profile',{happiness: averageScore, totalEntries: usersEntries.length})
})

module.exports = router;
