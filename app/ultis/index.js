"use strict";
const router = require("express").Router();
const db = require("../db");
const crypto = require("crypto");

let _registerRoutes = (routes, method) => {
  //_registerRoute is made private by prefixing with an underscore
  for (let key in routes) {
    if (
      typeof routes[key] === "object" &&
      routes[key] !== null &&
      !(routes[key] instanceof Array)
    ) {
      _registerRoutes(routes[key], key);
    } else {
      if (method === "get") {
        router.get(key, routes[key]);
      } else if (method === "post") {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
};

let route = routes => {
  _registerRoutes(routes);
  return router;
};
let findOne = profileID => {
  return db.userModel.findOne({
    profileId: profileID
  });
};
//create a new user snd return the instance

let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ""
    });
    newChatUser.save(error => {
      if (error) {
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
};

// let createNewRoom = (room) => {
//   return new Promise((resolve, reject) => {
//     let newChatRoom = new db.roomModel({
//       roomId: room.id,
//       name: room.name
//     });
//     newChatRoom.save(error => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(newChatRoom);
//       }
//     });
//   });
// };

let findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

//Find room by name
let findRoomByname = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if (element.room === room) {
      return true;
    }
    return false;
  });
  return findRoom > -1 ? true : false;
};

//Generate a unoque ID
let generateRoomId = () => {
  return crypto.randomBytes(24).toString("hex");
};

//Find a chatRoom with a given ID
let FindRoomByID = (allrooms, roomID) => {
  return allrooms.find((element, index, array) => {
    if (element.roomID === roomID) {
      return true;
    } else {
      return false;
    }
  });
};

//Add a user to a chatRoom
let addUserToRoom = (allrooms, data, socket) => {
  //Get the room object
  let getRoom = FindRoomByID(allrooms, data.roomID); 
  if (getRoom) {
    //Get the active user ID (object from session)
    let userID = socket.request.session.passport.user;
    //check to see if the user already exists in the chatroom
    let checkkUser = getRoom.users.findIndex((element, index, array) => {
      if(element.userID === userID) {
        return true;
      }else{
        return false;
      }
    });

    //If the user is already in the room, remove him first
    if(checkkUser > -1){
      getRoom.users.splice(checkkUser, 1);
    }
    //Push the user into the user array
    getRoom.users.push({
      socketID: socket.id,
      userID,
      user: data.user,
      userPic: data.userPic
    });

    //join the room channel
    socket.join(data.roomID);

    //Return th updated room object
    return getRoom
  }
};

module.exports = {
  route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByname,
  generateRoomId,
  FindRoomByID,
  addUserToRoom,
};
