const express = require('express');
const mustacheExpress = require('mustache-express');
// const robotsData = require('./data');
const robotDal = require('./dal');
const bodyParser = require('body-parser');
// const robot= robotsData.users;
const app = express();

// I need express-session, connect-mongo, and passport.

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static('public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// console.log(robotsData.users)

// all bots
app.get('/', function(request, response){
    robotDal.getAllRobots().then(function (bots){
      response.render("robots", { robots: bots})
      console.log(bots);
    });
})
//
// 1 bot profile
app.get('/robots/:id', function (request, response) {
  const chosenRobot = robotDal.getRobot(parseInt(request.params.id));
  if (chosenRobot.id) {
    response.render('robotDetails', chosenRobot);
  } else {
    response.send('NO ROBOT!!!');
  }
})

// app.get('/login', function(req, res){
//   res.render('login')
// })
//
// app.post('./loggged', function(req, res){
//   res.redirect('/')
// })

//
// app.get('/employedbots', function (request, response){
//   const roboEmp = robotDal.getEmployedRobots();
//   response.render('employed', {roboEmp});
// })
//
// app.get('/unemployedbots', function (request, response){
//   const roboUnEmp = robotDal.getUnemployedRobots();
//   response.render('unemployed', {roboUnEmp});
// })


app.set ('port', 3000);

app.listen (3000, function(){
  console.log('Application has started at Port 3000');
});
