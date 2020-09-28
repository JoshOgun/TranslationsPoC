// const http = require("http");
// var express = require("express");
// var app = express();
// const fs = require('fs').promises;
// const host = 'localhost';
// const port = 8000;
//
// app.get("/", function(req, res) {
//   res.status(200).sendFile(path.join(__dirname + "index.html"));
// });
//
// const requestListener = function (req, res) {
//     fs.readFile(__dirname + "/index.html")
//     .then(contents => {
//           res.setHeader("Content-Type", "text/html");
//           res.writeHead(200);
//           res.end(contents);
//       })
//       .catch(err => {
//             res.writeHead(500);
//             res.end(err);
//             return;
//         });
// };
//
//
// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });

const express = require('express');
var path = require("path");
const app = express();

app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/index.html"));
});

app.listen(8000, () => {
  console.log('Server is running on http://http://localhost:8000/')
});
