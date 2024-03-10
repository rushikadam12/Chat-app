require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const DB = require("./src/DB/DBconnection");

const server = http.createServer(app);

const startServer = () => {
  server.listen(process.env.PORT || 3000, () => {
    console.log("server is online:", process.env.PORT || 3000);
  });
};

DB().then(() => {
  startServer();
}).catch((error) => [console.log(error)]);
