var router = require('express').Router();
var db = require('../models');
var passport = require('passport');


//GO TO HOMEPAGE
router.get('/', function(req, res) {
      res.render('index')
})



//REGISTER NEW USER
router.post('/register/user', function(req, res){
      var firstName = req.body.firstname;
      var lastName = req.body.lastname;
      var email = req.body.email;
      var password = req.body.password;

      //POST NEW USER TO DATABASE
      db.user.create(req.body).then(function(user) {
            //AUTO SIGNIN NEW USER
            req.login(user, function(err){
                  console.log("inside req.login and it works, user.id: " + user.id);

                  if (err) {
                        console.log(err);
                        return next(err); 
                  };
                  console.log('newUsers first name is: ' + req.user.firstName);
                  //need to redirect to react to display form data (income, expenses, etc...)

            })
      
      });
      
});

//GO TO SIGNIN PAGE
router.get('/user/signin', function(req, res){      

//SIGNIN USER

router.post('/signin', passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/user/signin'
      })
      // , function(req, res){
      //       res.redirect('/dashboard')
      // }
);

//SIGNOUT USER
router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
});

//REDIRECT IF USER NOT SIGNED IN
router.use(function(req, res, next){
      if (!req.user){
            res.redirect('/user/signin')
      }else{
            return next();
      };
})



//GO TO USER DASHBOARD
router.get('/dashboard', function(req, res){
      console.log('this is the user: ' + req.user);
      console.log('User is authenticted: ' + req.isAuthenticated());
      res.render('userDashboard', {layout:'interior'});

});

module.exports = router