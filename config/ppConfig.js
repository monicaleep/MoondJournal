const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

// configure the strategy
passport.serializeUser((user,doneCallback)=>{
  console.log('serializing user...');
  doneCallback(null, user.id)
});

passport.deserializeUser((id, doneCallback)=>{
  db.user.findByPk(id)
  .then(foundUser=>{
    console.log('deserializing user...');
    doneCallback(null,foundUser)
  })
  .catch(err=>{
    console.log('error deserializing user \n',err)
  })
})

// const fieldsToCheck = {
//   usernameField: 'email',
//   passwordField: 'password'
// }
//
// const findAndLoginUser = (email, password, doneCallback) =>{
//   db.user.findOne({where: {email}})
//   .then(async foundUser=>{
//      let match = await foundUser.validPassword(password)
//     if(!foundUser || !match){  // something wrong with the user
//       console.log('hit this route')
//       return doneCallback(null,false) //send back false
//     } else { //user was legit
//       return doneCallback(null, foundUser) //send the user object
//     }
//   })
//   .catch(err=>doneCallback(err)
//   )
// }

//const strategy = new LocalStrategy(fieldsToCheck, findAndLoginUser)

// passport.use(strategy)
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, doneCallback) => {
        console.log("passport-local is now trying to authenticate this user:", email)
        db.user.findOne({where:{email:email}})
        .then( async foundUser=>{
          let match;
          if (foundUser){
            match = await foundUser.validPassword(password)
          }
            if (!foundUser ||  !match) {
                return doneCallback(null, false)
            } else {
                return doneCallback(null, foundUser);
            }
        })
        .catch(err=>doneCallback(err))
    }
))

module.exports = passport
