require('dotenv').config()
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const methodOverride = require('method-override');
//setup ejs and ejs layouts
app.set('view engine','ejs')
app.use(ejsLayouts)

app.use(express.urlencoded({ extended: false })) // to use the body parser
app.use(express.static(__dirname + '/public/')) //to use the css files
app.use(methodOverride('_method')); // for put and delete



// body parser middleware - above controller middleware
app.use(express.urlencoded({ extended: false }))

// session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// passport middleware - should come after session config
app.use(passport.initialize());
app.use(passport.session());

//flash middleware goes after session middleware!!!
app.use(flash());

//CUSTOM MIDDLEWARE
app.use((req,res,next)=>{
  //before every route, attach the flash messages and current user to res.locals;
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})


//controllers middleware
app.use('/auth',require('./controllers/auth'));
app.use('/journal',require('./controllers/journal'))
app.use('/todo',require('./controllers/todo'))


app.get('/profile',isLoggedIn,(req,res)=>{
  res.render('profile')
})

app.get('/',(req,res)=>{
    res.render(`home`)

})


const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})
