// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var session = require('express-session')
var validator = require('express-validator');
var db = require('./models');
var path = require("path");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var routes = require('./routes');
var application = require('./routes/application')
// var user = require('./routes/user')

// CREATE SERVER
var app = express();
var PORT = process.env.PORT || 8000;

// MIDDLEWARE
app.use(logger('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());
app.use(cookieParser());

//VIEW ENGINE
app.engine('handlebars', exphbs({ defaultLayout: 'exterior' }));
app.set('view engine', 'handlebars');

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//SESSION STORAGE
app.use(session({
  secret: 'applesandoranges',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

//USER AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('this is inside serialize')
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("inside deserialize:" + id)
  db.user.find({where: {id: id}}).then(function(user){
      done(null, user);
  }).catch(function(err){
      done(err, null)
  });
  
});

passport.use(new LocalStrategy({
usernameField: 'email',
},
function(email, password, done) {
  console.log("inside local strategy directly above db query")
  db.user.find({where: {email:email}}).then(function(result){
    console.log('this is the result with the query promise: ' + result.password);
    hash = result.password;
    console.log('done:', done)
    return db.user.validPassword(password, hash, result, done)
      
  });
 
}));

// ROUTING
app.use( require('./routes/index'))
app.use(require('./routes/application'))
app.use(require('./routes/api'))

// RUN SERVER
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log('Server running at http://localhost:' + PORT)
  })
})