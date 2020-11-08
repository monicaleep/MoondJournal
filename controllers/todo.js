const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/',isLoggedIn,(req,res)=>{
  console.log(req.session.passport.user)
  db.todo.findAll({
    where: {
      userId: req.session.passport.user
    }
  })
  .then(foundTodos=>{
    //console.log(foundTodos)
    res.render('todo/index',{foundTodos})
  })
})


router.get('/new',isLoggedIn,(req,res)=>{
  res.render('todo/new')
})

router.put('/:id',isLoggedIn,(req,res)=>{
  const today = new Date();
  db.todo.update({
    lastdone: today,
  },{
    where: {
      id: req.params.id
    }
  })
  .then(numRowsUpdated=>{

    res.redirect('/todo')
  })

})


router.post('/',isLoggedIn,(req,res)=>{
  db.todo.create({
    task: req.body.task,
    userId: req.session.passport.user,
    lastdone: null,
  })
  .then((createdTask)=>{
    console.log(createdTask)
    res.redirect('/todo')
  })
})
module.exports = router;
