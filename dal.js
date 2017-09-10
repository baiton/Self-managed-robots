const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robots');  //I will make your DB!
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/robots';
let robots = require('./models/robots');
const ProfileModel = require('./models/robots')
const moment = require('moment')



function getAllRobots (){
  return new Promise ((resolve, reject) =>{
    MongoClient.connect(url, function(err, db){
      // console.log(db);
      const collection = db.collection('users')
      collection.find({}).toArray(function(err, docs){
        // console.log("docs", docs);
        resolve(docs);
        reject(err);
      })
    })
  })
}

function newProfile (info){
  let newbot = new ProfileModel (info);
  newbot.save(function(err){
    console.log(err);
  })
  return Promise.resolve('success');
}

// function addProfileToDb(info){
// db.users.insertOne( info )
// }

function getBotsByUsername(username){
  return ProfileModel.findOne({'username': username}).catch(function(err){
    console.log("Error!", err);
  })
}

function createToken ({ _id, name, email, roles }) {
  const payload = {
    sub: _id,
    name,
    email,
    roles,
    iat: moment().unix(),
    exp: moment().add(1, 'day').unix()
  }
  return jwt.sign(payload, TOKEN_SECRET)
}

function ensureAuthenticated (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({
        message: 'Please make sure your request has an Authorization header'
      })
  }
  const token = req.headers.authorization.split(' ')[1]
  const { exp, name, email, roles, _id } = jwt.verify(token, TOKEN_SECRET)
  console.log('PAYLOAD', exp, name, email, roles, _id)
  if (exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' })
  }
  req.user = { name, email, roles, _id }
  next()
}

function checkRole (role, user) {
  return user.roles.indexOf(role) > -1
}

// function createToken({})

// function connectToMongodb(url, cb){
//   MongoClient.connect(url, cb)
// }
//
// function getRobots(){
//   connectToMongodb(url, getAllDocs)
//     return robots;
//   }

  module.exports = {
    getBotsByUsername: getBotsByUsername,
    getAllRobots: getAllRobots,
    robots: robots,
    newProfile: newProfile,
    ensureAuthenticated: ensureAuthenticated,
    createToken: createToken,
    checkRole: checkRole
  }















  // now what do i need?  make an array for each group of robots you will need
  // let bots by country = [] //hard mode


  // first you have to connect to the server where your db is


// MongoClient.connect(url)
//   .then(function (db) { // <- db as first argument
//     console.log("db", db)
//   })
//   .catch(function (err) {})
//
//
// function getAllDocs(err, db) {
//   const collection = db.collection('people')
//   let documents = [];
//   collection.find({}).toArray(function(err, docs) {
//     bots = docs;
//     db.close()
//   })
// }
//
//
// async function getAllRobots() {
//   var db = await MongoClient.connect(url);
//   let collection = db.collection('users');
//   // for each robot object/document in users collection, assign to documents which assigns robots
//   let documents = [];
//   var robots = await collection.find();
//   return robots;
//   console.log("robots", robots);
// }
// get only 1 robot
// function getRobot(robotId) {
//   let chosenRobot = {}
//   for (i = 0; i < robot.length; i++) { //look into the for loop like "for (let i in robots){ }"
//     if (robot[i].id === robotId) {
//       chosenRobot = robot[i];
//     }
//   }
//   return chosenRobot;
// }
//
// // unemployed robots only
// async function findUnemployedRobots(err, db) {
//   // console.log('error 1' + err);
//   let collection = db.collection('robots');
//   let documents = [];
//   let unemployedRobots = await collection.find({
//     job: null
//   })
//   return unemployedRobots;
// };
//
// function getUnemployedRobots() {
//   connectToMongodb(url, findUnemployedRobots)
//   console.log(unemployedRobots);
//   return unemployedRobots;
// }
//
// // employed robots only
// function findEmployedRobots(err, db) {
//   // console.log('error 1' + err);
//   let collection = db.collection('robots');
//   let documents = [];
//   collection.find({
//     jobs: {
//       $not: {
//         $in: [null]
//       }
//     }
//   }).toArray(function(err, docs) {
//     employedRobots = docs;
//     db.close();
//   });
// }
//
// function getEmployedRobots() {
//   connectToMongodb(url, findEmployedRobots)
//   console.log(employedRobots);
//   return employedRobots;
// }
//



// old code
// function getRobots(){
//   return robot;
// }
//
//
// function getRobot(robotId){
// let chosenRobot={}
// for (i=0;i < robot.length ; i++){
//   if (robot[i].id === robotId){
//     chosenRobot = robot[i];
//   }
// }
// return chosenRobot;
// }
//
// module.exports = {
//   getRobots: getRobots,
//   getRobot: getRobot,
// }
