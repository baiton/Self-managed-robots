const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const app = express();
const session = require('express-session')
const dal = require('./dal')
// const robots =[];
const { Strategy: LocalStrategy } = require('passport-local')
const Robots = require('./models/robots.js')

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res){
    res.redirect('./login')
})

app.post('/login', (req, res) => {
    Robots.findOne({ username: req.body.username }, 'username password', function (err, user, next) {
      if (err) return next(err)
      if (!user) {
        // console.log("user", user);
        return res.redirect("./login")
      }
      // user.comparePassword(req.body.password, user.password, ( err, isMatch ) => {
      //   if (!isMatch) {
      //     console.log("password is incorrect");
      //     return res.redirect("./login")
      //   }
        // let token = { token: createToken(user)};
        // console.log("You made it!");
        res.redirect('/robots');
      })
    })
  // })


app.get('/robots', function(req, res) {
  // console.log("dal.getRobots", dal.getRobots());
    const robots = dal.getRobots()
// getAllRobots does provide response as an array of robots... but how do I use them
    res.render('robots', { robots })
})

app.get('/robot/:_id', function (req, res) {
    const chosenRobot = dal.getRobot(req.params._id)
    console.log("chosenRobot", chosenRobot);
      res.render('robotDetails', chosenRobot)
})

app.post('/robots', function(req, res){
    dal.addRobot(req.body.name, req.body.email, req.body.university, req.body.job, req.body.company, req.body.skills, req.body.phone, req.body.avatar, req.body.username, req.body.password);
    // console.log(req.body.password)
    res.redirect('./robots')
})

app.get('/addrobot', function(req, res){
    res.render('addrobot')
})

app.get('/login', function(req, res){
    res.render('login')
  })


  app.get('/register', (req, res) => {
    res.render('register')
  })

  app.post('/register', (req, res) => {
    dal.addRobot(req.body)
    res.redirect('/robots')
  })

app.get('/editrobot/:_id', function (req, res){
  const chosenRobot = dal.getRobot(req.params._id)
  console.log(req.params._id);
    // const editedRobot = dal.getRobot(req.params._id)
    res.render('editrobot', chosenRobot)
})

app.post('/editrobot/:_id', (req, res) => {
    const id = req.params._id
    const {name, email, university, job, company, skills, phone, avatar} = req.body
    const newRobot = Object.assign({}, {
      name,
      email,
      university,
      job,
      company,
      skills,
      phone,
      avatar,
      address: []
    })
    dal.editRobot(id, newRobot)
    res.redirect('/robots')
})

app.listen(3000, function(){
    console.log('listening on port 3000');
})
