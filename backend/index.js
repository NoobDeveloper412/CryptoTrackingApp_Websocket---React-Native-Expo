const express = require("express");
const socketIO = require("socket.io");
const PORT = 8000;

const server = express().listen(PORT, () => {
  console.log(`App Running on PORT=${PORT}\nhttp://localhost:${PORT}/`);
});

const socketHandler = socketIO(server);

socketHandler.on("connection", () => {
  console.log("Connected to the client.");
    socketHandler.emit("crypto", {
        message: "Success connected to the client.",
      });

});
