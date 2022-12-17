const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");
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

axios
  .get(
    "https://data.messari.io/api/v1/assets?fields=id,slug,symbol,metrics/market_data/price_usd"
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
