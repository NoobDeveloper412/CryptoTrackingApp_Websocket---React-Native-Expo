const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

const server = app.listen(PORT, () => {
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
    .get(process.env.CRYPTO_API, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
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
      socketHandler.emit("crypto", {
        error: true,
        message: err,
      });
    });
};

setInterval(() => {
  getList();
}, 20000);

// APIs for the frontend

app.get("/cryptos/profile/:id", (request, response) => {
  const cryptoId = request.params.id;
  axios
    .get(`${process.env.CRYPTO_BASE_URL}/${cryptoId}/profile`, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
    .then((responseData) => {
      response.json(responseData.data.data);
    })
    .catch((err) => {
      response.json({
        error: true,
        message: err.message,
      });
    });
});
