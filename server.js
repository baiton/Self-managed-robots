const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const bcrypt = require('bcrypt');
const User = require('./models/robots')
const { getBotsByUsername: getBotsByUsername,
getAllRobots: getAllRobots,
robots: robots,
newProfile: newProfile,
ensureAuthenticated: ensureAuthenticated,
createToken: createToken,
checkRole: checkRole } = require('./dal')

// I need express-session, connect-mongo, and passport.

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static('public'));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

const saltRounds = 10;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  homepage: 1,
  cookie: {
    secure: true
  }
}))



app.use(function(req, res, next){
  if(!req.session.isAuthenticated){
    req.session.isAuthenticated = false;
  }

})
// --------------------------------------------
// ----------------Login-----------------------
// --------------------------------------------
app.get('/login', function(req, res) {
  res.render('login')
})

app.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, '+password', function (
    err,
    user,
    next
  ) {
    if (err) return next(err)
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' })
    }
    //referencing the function's parameter user
    user.comparePassword(req.body.password, user.password, function (
      err,
      isMatch
    ) {
      console.log('is match', isMatch)
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email and/or password' })
      }
      res.send({ token: createToken(user), roles: user.roles })
    })
  })
})




// app.post('/logged', ((req, res) => {
//   User.findOne({ username: req.body.username }, '+password', function (
//     err,
//     user,
//     next
//   ) {
//     if (err) return next(err)
//     if (!user) {
//       return res.status(401).send({ message: 'Wrong email and/or password' })
//     }
//     user.comparePassword(req.body.password, user.password, function (
//       err,
//       isMatch
//     ) {
//       console.log('is match', isMatch)
//       if (!isMatch) {
//         return res.status(401).send({ message: 'Wrong email and/or password' })
//       }
//       res.send({ token: createToken(user), roles: user.roles })
//     })
//   })
// }))
//
// app.post('/logged', function(req, res) {
//   const hash = bcrypt.hashSync(password, 8);
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });
//   // getCharByUsername(req.body.username)
//   res.redirect('/')
// })

// ------------sign-up------------------

app.get("./register", (req, res) => {
  User.find({}, (err, users) => {
    res.send(users)
  })
})
app.post("./register", (req, res) => {
  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' })
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    user.save(() => {
      res.send({ token: createToken(user), message: 'User has been created' })
    })
  })
})



// app.get('/register', (req, res) => {
//   res.render('sign_up')
// })
//
// app.post('/registered', (req, res) => {
//   // newProfile(req.body).then(function(bot) {
//     res.send('Success!');
//   })





// all bots
app.get('/', function(req, res) {
  // console.log(req.session)
  robotDal.getAllRobots().then(function(bots) {
    res.render("robots", {
      robots: bots
    })
  });
})
//
// 1 bot profile
app.get('/robots/:id', function(req, res) {
  const chosenRobot = robotDal.getRobot(parseInt(req.params.id));
  if (chosenRobot.id) {
    res.render('robotDetails', chosenRobot);
  } else {
    res.send('NO ROBOT!!!');
  }
})

// ------------Unemployed render---------------
app.get('/unemployedbots', function(req, res) {
  res.render('./unemployed')
})

// ------------Employed Render-----------------
app.get('/employedbots', function(req, res) {
  res.render('./employed')
})

app.set('port', 3000);

app.listen(3000, function() {
  console.log('Application has started at Port 3000');
});
