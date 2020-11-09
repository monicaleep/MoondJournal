const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

// index route, show all tasks for the logged in user
router.get('/',isLoggedIn,(req,res)=>{
  db.user.findByPk(req.user.id)
  .then(user=>{
    user.getTodos().then(todos=>{
      res.render('todo/index',{foundTodos:todos})
    })
  })
  .catch(err=>{
    console.log(err)
  })
})

// new route - render new form
router.get('/new',isLoggedIn,(req,res)=>{
  res.render('todo/new')
})

// update route - change date of last done task to today's date
router.put('/:id',isLoggedIn,(req,res)=>{
  const today = new Date(); // TODO check if user is owner
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

// create route - create a new task
router.post('/',isLoggedIn,(req,res)=>{
  db.todo.create({
    task: req.body.task,
    userId: req.user.id,
    lastdone: null,
  })
  .then((createdTask)=>{
    req.flash(`success`,`Added ${req.body.task} to your ideas list!`)
    res.redirect('/todo')
  })
})


// delete route - delete a task from DB TODO check if user is owner
router.delete('/:id',isLoggedIn,(req,res)=>{
  db.todo.destroy({
    where: {id: req.params.id}
  })
  .then(numRowsDeleted=>{
    res.redirect('/todo')
  })
})

module.exports = router;
