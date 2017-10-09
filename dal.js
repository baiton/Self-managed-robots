const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/robots'
const Robots = require('./models/robots')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
let robots = [];

mongoose.connect(url, {
  useMongoClient: true
})


function getAllDocs (err, db) {
  let collection = db.collection('users')
  let documents = []
  console.log("This is my collection", collection);
  collection.find({}).toArray(function (err, docs) {
    robots = docs
    db.close()
  })
}

function connectMongodb (url, cb) {
  MongoClient.connect(url, cb)
}

function getRobots () {
  connectMongodb(url, getAllDocs)
  return robots;
}


function getRobot (robotId) {
    connectMongodb(url, getAllDocs)
    for (let i = 0; i < robots.length; i++){
      if (robots[i]._id == robotId) {
        return robots[i]
      }
    }
  }

function getAllRobots () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      const collection = db.collection('users')
      collection.find({}).toArray(function (err, docs) {
        robots = docs
        console.log("robots", robots);
        // this is logging but the information isn't passing to display on page
        resolve(robots)
        reject(err)
      })
    })
  })
}

// Use connect method to connect to the server


function addRobot (name, email, university, job, company, skills, phone, avatar, username, password){
  const robo = Robots.create({name: name, university: university, job: job, company: company, skills: skills, phone: phone, avatar: avatar, username: username, password: password}, function (err, Robots){
    Robots.save()
  })
}

function getRobotById(robotId){
  console.log(robotId)
  return Robots.findOne({'_id':robotId})
}

function editRobot(id, updatedRobot){
  return Robots.findOneAndUpdate( {'_id':id}, updatedRobot, {upsert: true}, function(err, doc){
      if(err) return console.log(err)
      console.log("from editRobot dal method", doc)
    })
  }

function logout(logout){
  logout.destroy();
}

module.exports = { getRobots: getRobots, getAllRobots: getAllRobots, getRobot: getRobot, addRobot: addRobot, getRobotById: getRobotById, logout: logout, editRobot: editRobot }
