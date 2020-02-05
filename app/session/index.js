const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if(process.env.NODE_ENV === 'production'){
    //load production session storage
    module.exports = session({
        secret: config.dataBaseKey,
        proxy: true,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: db.mongoose.connection
        })
    })
}
else{
    //load development session storage
    module.exports = session({
        secret: config.dataBaseKey,
        resave: false,
        saveUninitialized: true
    })
}