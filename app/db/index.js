const config = require("../config");
const Mongoose = require("mongoose");



Mongoose.connect(config.dataBaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});

//log an error if the connection fails
Mongoose.connection.on("error", error => {
  console.log(error);
});

const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

// const rooms = new Mongoose.Schema({
//   roomId: String,
//   name: String
// })

let userModel = Mongoose.model('chatUser', chatUser);
// let roomModel = Mongoose.model('rooms', rooms);

module.exports = {
    Mongoose,
    userModel,
    // roomModel
}