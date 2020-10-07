const express = require('express');
var path = require("path");
var fs = require('fs');
var engJson = require("./en.json");
var espJson = require("./es.json");
const app = express();


app.use("/public", express.static(path.join(__dirname + "/public")));

app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/uploadFile.html"));
});

app.get("/Spanish", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/getJSON", function(req, res) {
  var retrievedFile = require("./"+Object.keys(req.query)[0]);
  console.log("File Retrieved.");
  return res.send(retrievedFile);
});

app.get("/loadIdenticals", function(req, res) {
  var retrievedFile = require("./identicals.json");
  console.log("File Retrieved.");
  return res.send(retrievedFile);
});


app.get("/updateSpanish", function(req, res) {
  const getQuery = JSON.stringify(req.query, null, "\t");
  console.log(getQuery);
  fs.writeFile('enNew.json', getQuery, 'utf8', function (err) {
    if (err) throw err;
    console.log('File Uploaded!');
  });

  return res.status(200).end();
});



app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000/')
});
