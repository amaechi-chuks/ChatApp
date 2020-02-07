const config = require("../config");
const Mongoose = require("mongoose");
const logger = require('../logger')

Mongoose.connect(config.dataBaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});

//log an error if the connection fails
Mongoose.connection.on("error", error => {
  logger.log(`User Error Connecting to Mongoose ${error}`);
});

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

// export model user with UserSchema
module.exports = Mongoose.model("user", UserSchema);