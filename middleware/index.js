// Middleware
var middlewareObj = {};


// Make sure authenticated before they go here
middlewareObj.checkAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in first!');
    res.redirect('/login');
  }
  
  // We don't want people to go here if they are already authenticated
middlewareObj.checkNotAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }

  module.exports = middlewareObj;