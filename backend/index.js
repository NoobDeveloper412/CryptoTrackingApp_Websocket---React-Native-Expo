const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

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

const getList = () => {
  axios
    .get(process.env.CRYPTO_API)
    .then((response) => {
      const priceList = response.data.data.map((currency) => {
        return {
          id: currency.id,
          name: currency.symbol,
          price: currency.metrics.market_data.price_usd,
        };
      });

      socketHandler.emit("crypto", priceList);
    })
    .catch((err) => {
      console.log(err);
    });
};
