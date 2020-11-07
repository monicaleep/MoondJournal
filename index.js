const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
//setup ejs and ejs layouts
app.set('view engine','ejs')
app.use(ejsLayouts)

// body parser middleware - above controller middleware
app.use(express.urlencoded({ extended: false }))

// session configuration
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// passport middleware - should come after session config
app.use(passport.initialize());
app.use(passport.session());

//controllers middleware
app.use('/auth',require('./controllers/auth'))


app.get('/',(req,res)=>{
  if(req.user){
    res.send(`current user: ${req.user.name}`)
  } else {
    res.send(`No user currently logged in`)
  }
})


const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})
