const db = require('./models');

db.entry.findAll({
  order: [['date','DESC']]
}).then(found=>{
  console.log(found)
})
