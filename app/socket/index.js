"use strict";
const ultility = require("../ultis");

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;

  io.of("/roomslist").on("connection", socket => {
    socket.on("getChatRooms", () => {
      socket.emit("chatRoomsList", JSON.stringify(allrooms));
    });
    socket.on("createNewRoom", newInputRoom => {
      if (!ultility.findRoomByname(allrooms, newInputRoom)) {
        //check if a room exists, if not create a new room and bradcast it

        //create a new room and broadcast it to all users
        allrooms.push({
          room: newInputRoom,
          roomID: ultility.generateRoomId(),
          users: []
        });
        socket.emit("chatRoomsList", JSON.stringify(allrooms));

        //Emit a realtime updated list
        socket.broadcast.emit("chatRoomsList", JSON.stringify(allrooms));
      }
    });
  });
  io.of('/chatter').on('connection', socket => {
    //Join a chatroom
    socket.on('join', data => {
        let usersList = ultility.addUserToRoom(allrooms, data, socket);
        // Update the list of active users as shown on the chatroom page
        socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
        socket.emit('updateUsersList', JSON.stringify(usersList.users));
        socket.broadcast.emit('displays', data);
    });
    // Disconnect user from rooms
    socket.on('disconnect', ()=>{
      const {user} = socket;
      let room = ultility.removeUserFromRoom(allrooms, socket);
      socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
      socket.broadcast.emit('userLeft', data);
    });
    socket.on('message', data =>{
     socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });
    socket.on('typing', (data)=>{
      socket.broadcast.emit('display', data);
    });
});
};

