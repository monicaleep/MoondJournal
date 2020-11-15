const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

// index route, show all tasks for the logged in user -- GET request to /todo
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const user = await db.user.findByPk(req.user.id)
    const todos = await user.getTodos({
      order: [
        ['lastdone', 'DESC']
      ]
    })
    res.render('todo/index', {
      foundTodos: todos
    })
  } catch (err) {
    console.log(err)
    res.redirect('/todo')
  }
})

// new route - render new form -- GET request to /todo/new
router.get('/new', isLoggedIn, (req, res) => {
  res.render('todo/new')
})

// update route - change date of last done task to today's date -- PUT request to /todo/:id
router.put('/:id', isLoggedIn, async (req, res) => {
  const today = new Date();
  try {
    await db.todo.update({
      lastdone: today,
    }, {
      where: {
        id: req.params.id
      }
    })
    res.redirect('/todo')
  } catch (err) {
    console.log(err);
    res.redirect('/todo')
  }
})

// create route - create a new task -- POST request to /todo
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const createdTask = await db.todo.create({
      task: req.body.task,
      userId: req.user.id,
      lastdone: null,
    })
    req.flash(`success`, `Added "${req.body.task}" to your ideas list!`)
    res.redirect('/todo')
  } catch (err) {
    console.log(err)
    res.redirect('/todo')
  }
})


// delete route - delete a task from DB -- DELETE request to /todo/:id
router.delete('/:id', isLoggedIn, async (req, res) => {
  try{
    await db.todo.destroy({
      where: {
        id: req.params.id
      }
    })
    res.redirect('/todo')
  } catch(err){
    console.log(err)
    res.redirect('/todo')
  }
})

module.exports = router;
