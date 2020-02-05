const config = require("../config");
const Mongoose = require("mongoose");

Mongoose.connect(config.dataBaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});

//log an error if the connection fails
Mongoose.connection.on("error", error => {
  console.log(error);
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