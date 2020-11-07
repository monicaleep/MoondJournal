const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts')

//setup ejs and ejs layouts
app.set('view engine','ejs')
app.use(ejsLayouts)

// body parser middleware - above controller middleware
app.use(express.urlencoded({ extended: false }))

//controllers middleware
app.use('/auth',require('./controllers/auth'))


app.get('/',(req,res)=>{
  res.send('work work work')
})


const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})
