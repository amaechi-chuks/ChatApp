"use strict";
const routeHelper = require("../ultis");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const ultility = require("../ultis");
const User = require("../db/user");
const auth = require("../auth/user");
const logger = require('../logger')

module.exports = () => {
  let routes = {
    get: {
      "/": (req, res, next) => {
        res.render("login");
      },
      "/rooms": [
        routeHelper.isAuthenticated,
        (req, res, next) => {
          res.render("rooms", {
            user: req.user,
            host: config.host
          });
        }
      ],
      "/chat/:id": [
        routeHelper.isAuthenticated,
        (req, res, next) => {
          let findRoom = ultility.FindRoomByID(
            req.app.locals.chatrooms,
            req.params.id
          );
          if (findRoom === undefined) {
            return next();
          } else {
            res.render("chatroom", {
              user: req.user,
              host: config.host,
              room: findRoom.room,
              roomID: findRoom.roomID
            });
          }
        }
      ],
      "/auth/user": [
        auth,
        async (req, res) => {
          try {
            // request.user is getting fetched from Middleware after token authentication
            const user = await User.findById(req.user.id);
            res.json(user);
          } catch (e) {
            res.send({ message: "Error in Fetching user" });
          }
        }
      ],

      "/auth/facebook": passport.authenticate("facebook"),
      "/auth/facebook/callback": passport.authenticate("facebook", {
        successRedirect: "/rooms",
        failureRedirect: "/"
      }),
      "/auth/twitter": passport.authenticate("twitter"),
      "/auth/twitter/callback": passport.authenticate("twitter", {
        successRedirect: "/rooms",
        failureRedirect: "/"
      }),
      "/auth/google": passport.authenticate("google", { scope: ["profile"] }),
      "/auth/google/callback": passport.authenticate("google", {
        successRedirect: "/rooms",
        failureRedirect: "/"
      }),
      "/logout": (req, res) => {
        req.logout();
        res.redirect("/");
      }
    },
    post: {
      "/register": [
        check("username", "Please Enter a Valid Username")
          .not()
          .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
          min: 6
        }),
        async (req, res, next) => {
          // First Validate The Request
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({
              errors: errors.array()
            });
          }
          const { username, email, password } = req.body;
          try {
            let user = await User.findOne({
              email
            });
            if (user) {
              return res.status(400).json({
                msg: "User Already Exists"
              });
            }

            user = new User({
              username,
              email,
              password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
              user: {
                id: user.id,
                email: user.email,
                username: user.username
              }
            };

            jwt.sign(
              payload,
              "randomString",
              {
                expiresIn: 10000
              },
              (err, token) => {
                if (err) throw err;
                res.status(201).json({
                  message: "Succesfully created a user",
                  token: token,
                  status: 201,
                  data: { email, username }
                });
              }
            );
          } catch (err) {
            logger.log(err.message);
            res.status(500).send("/login");
          }
          
        }
      ],
      "/login": async (req, res) => {
        const { email, password } = req.body;
        try {
          let user = await User.findOne({
            email
          });
          if (!user)
            return res.status(400).json({
              message: "User Not Exist"
            });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return res.status(400).json({
              message: "Incorrect Password !"
            });

          const payload = {
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            }
          };

          jwt.sign(
            payload,
            "secret",
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                status: 200,
                token: token,
                message: "succesfully Signed In",
                data: {
                  username,
                  email
                }
              });
            }
          );
        } catch (e) {
          console.error(e);
          res.status(500).json({
            message: "Server Error"
          });
        }
      }
    },
    NA: (req, res, next) => {
      res.status(404).sendFile(process.cwd() + "/views/404.htm");
    }
  };
  return routeHelper.route(routes);
};
