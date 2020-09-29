const express = require('express');
var path = require("path");
var engJson = require("./en.json");
var espJson = require("./es.json");
const app = express();


app.use("/public", express.static(path.join(__dirname + "/public")));

app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/getEnglish", function(req, res) {
  return res.send(engJson);
});

app.get("/getSpanish", function(req, res) {
  return res.send(espJson);
});

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000/')
});
