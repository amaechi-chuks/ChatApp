"use strict";
const routeHelper = require('../ultis')
const passport = require('passport');
const config = require('../config');
const ultility = require('../ultis');

module.exports = () => {
  let routes = {
    'get': {
      '/': (req, res, next) => {
        res.render("login");
      },
      '/rooms': [routeHelper.isAuthenticated, (req, res, next) => {
        res.render("rooms", {
            user: req.user,
            host: config.host
        });
      }],
      '/chat/:id': [routeHelper.isAuthenticated, (req, res, next) => {
        let findRoom = ultility.FindRoomByID(req.app.locals.chatrooms, req.params.id);
        if(findRoom === undefined) {
          return next();
        }else{
          res.render("chatroom", {
            user: req.user,
            host: config.host,
            room: findRoom.room,
            roomID: findRoom.roomID
        })
        } 
      }],

      '/auth/facebook': passport.authenticate('facebook'),
      '/auth/facebook/callback': passport.authenticate('facebook', {
          successRedirect:'/rooms',
          failureRedirect: '/'
      }),
      '/auth/twitter': passport.authenticate('twitter'),
      '/auth/twitter/callback': passport.authenticate('twitter', {
          successRedirect:'/rooms',
          failureRedirect: '/'
      }),
      '/auth/google': passport.authenticate('google', { scope: ['profile'] }),
      '/auth/google/callback': passport.authenticate('google', {
          successRedirect:'/rooms',
          failureRedirect: '/'
      }),
      '/logout': (req, res) => {
          req.logout();
          res.redirect('/')
      }
      
    },
    'post': {},
    'NA': (req, res, next) => {
        res.status(404).sendFile(process.cwd() + '/views/404.htm')
    },
  };
return routeHelper.route(routes)
};
