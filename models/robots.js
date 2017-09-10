// This should be ready

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const RobotSchema = new mongoose.Schema({
  id: {type: String},
  username: {type: String, require: true, index: {unique: true} },
  password: {type: String, require: true, unique: true},
  name: {type: String, require: true},
  avatar: {type: String},
  email: {type: String, require: true},
  university: {type: String},
  job: {type: String},
  company: {type: String},
  skills: [{type: String}, {type: String}, {type: String}],
  phone: {type: String},
  address: {
    street_num: {type: String},
    street_name: {type: String},
    city: {type: String},
    state_or_province: {type: String},
    postal_code: {type: String},
    country: {type: String}
    }
  })

RobotSchema.pre('save', function (next){
  const user = this
  if (!user.isModified('password'))
   next()
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(user.password, salt, (err,hash) =>{
      user.password = hash
      next()
    });
  });
});

RobotSchema.methods.comparePassword = function (pass, dbPass, done) {
  //isMatch is res and can either be true or false.  does param 1 match param 2?  true or false
  //This comes from bcrypts built in function .compare() which takes plaintext password, hashed password and gives a funciton that errors or presents truthy/falsy
  bcrypt.compare(pass, dbPass, (err, isMatch)=>{
  done(err, isMatch)
  });
};

const User = mongoose.model('User', RobotSchema) //I will make your collection but plural!
module.exports= User;  //you are exporting the RobotSchema data in mongoose
