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

app.get('/robots', function(req, res) {
    const robots = dal.getRobots()
// getAllRobots does provide response as an array of robots... but how do I use them
    res.render('robots', { robots })
})

app.get('/robotDetail', function (req, res){
    res.render('robotDetail')
})

app.get('/_robot/:id', function (req, res) {
    const chosenRobot = dal.getRobot(req.params.id)
      res.render('robotDetail', chosenRobot)
})

app.post('/_robot/:id', function (req, res){
    res.redirect('./_robot/{{id}}')
})

app.post('/robots', function(req, res){
    dal.addRobot(req.body.name, req.body.email, req.body.university, req.body.job, req.body.company, req.body.skills, req.body.phone, req.body.avatar, req.body.username, req.body.password);
    console.log(req.body.password)
    res.redirect('./robots')
})

app.get('/addrobot', function(req, res){
    res.render('addrobot')
})

app.get('/login', function(req, res){
    res.render('login')
  })

app.post('/login', (req, res) => {
    Robots.findOne({ username: req.body.username }, 'username password', function (err, user, next) {
      if (err) return next(err)
      if (!user) {
        console.log("user", user);
        return res.redirect("./login")
      }
      // user.comparePassword(req.body.password, user.password, ( err, isMatch ) => {
      //   if (!isMatch) {
      //     console.log("password is incorrect");
      //     return res.redirect("./login")
      //   }
        // let token = { token: createToken(user)};
        console.log("You made it!");
        res.redirect('/robots');
      })
    })
  // })

app.get('/editrobot/:id', function (req, res){
    const editedRobot = dal.getRobot(req.params.id)
    res.render('editrobot', {editedRobot})
})

app.post('/editrobot/:id', (req, res) => {
    const id = req.params.id
    const newRobot = (req.body)
    dal.editRobot(id, newRobot)
    res.redirect('/robots')
    console.log(newRobot)
})

app.listen(3000, function(){
    console.log('listening on port 3000');
})
