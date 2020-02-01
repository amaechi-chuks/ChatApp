"use strict";

if (process.env.NODE_ENV === "production") {
  //offer production stage environment variables
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
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
      callbackURL: process.env.dataBaseUrl + "auth/twitter/callback",
      profileFields: ["id", "displayName", "photos"]
    },
    google: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientID,
      callbackURL: process.env.dataBaseUrl + "auth/google/callback",
      profileFields: ["id", "displayName", "photos"]
    }
   
  };
} else {
  //load development setting data
  module.exports = require("./development.json");
}
