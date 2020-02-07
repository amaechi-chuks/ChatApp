const config = require("../config");
const Mongoose = require("mongoose");
const logger = require('../logger');



Mongoose.connect(config.dataBaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});

//log an error if the connection fails
Mongoose.connection.on("error", error => {
 logger.log(`Mongoose Error Conecting to Db: ${error}`)
});

const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

//Create user Schema
const UserSchema = Mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

let userModel = Mongoose.model('chatUser', chatUser);
module.exports = {
    Mongoose,
    userModel,
}