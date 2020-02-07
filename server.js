"use strict";
const express = require("express");
const passport = require("passport");
const morgan = require('morgan');
const Chatapp = require("./app");

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(express.static('node_modules/babel-standalone'));
app.set('view engine', 'ejs');

app.use(Chatapp.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined', {
  stream: {
    write: message => {
      //write to Logs
      Chatapp.logger.log('info', message);
    }
  }
}))

app.use('/', Chatapp.router);

Chatapp.ioServer(app).listen(app.get("port"), () => {
  console.log("ChatApp running on Port", app.get("port"));
});
