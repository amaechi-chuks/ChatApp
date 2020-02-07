"use strict";

if (process.env.NODE_ENV === "production") {
  //offer production stage environment variables
  let redisURI = require('url').parse(process.env.REDIS_URL);
  let redisPassword = redisURI.auth.split(':')[1]

  module.exports = {
    host: process.env.host || "",
    dataBaseUrl: process.env.dataBaseUrl,
    dataBaseKey: process.env.dataBaseKey,
    fb: {
        clientID: process.env.fbClientID,
        clientSecret: process.env.fbClientSecret,
        callbackURL: process.env.dataBaseUrl + "auth/facebook/callback",
        profileFields: ["id", "displayName", "photos"]
    },
    twitter: {
      consumerKey: process.env.twConsumerKey,
      consumerSecret: process.env.twConsumerSecret,
      callbackURL: process.env.dataBaseUrl + "auth/twitter/callback",
      profileFields: ["id", "displayName", "photos"]
    },
    google: {
      clientID: process.env.ggClientID,
      clientSecret: process.env.ggClientSecret,
      callbackURL: process.env.dataBaseUrl + "auth/google/callback",
      profileFields: ["id", "displayName", "photos"]
    },
    redis: {
      host: redisURI.hostname,
      port: redisURI.port,
      password: redisPassword
    }
   
  };
} else {
  //load development setting data
  module.exports = require("../development.json");
}
