const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')


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

//flash middleware after session middleware!!!
app.use(flash());

//CUSTOM MIDDLEWARE
app.use((req,res,next)=>{
  //before every route, attach the flash messages and current user to res.locals;
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})


//controllers middleware
app.use('/auth',require('./controllers/auth'))

app.get('/profile',(req,res)=>{
  res.render('profile')
})

app.get('/',(req,res)=>{
    res.render(`home`)
})


const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})
