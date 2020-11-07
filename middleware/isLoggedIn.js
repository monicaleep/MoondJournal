module.exports = (req,res,next) =>{
  if (!req.user){
    req.flash('error','you must be logged in to do that!!');
    res.redirect('/auth/login')
  } else {
    next()
  }
}
