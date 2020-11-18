const express = require('express');
var path = require("path");
var fs = require('fs');
const app = express();


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use("/public", express.static(path.join(__dirname + "/public")));

app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/upgrade", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/upgrade.html"));
});

app.get("/getJSON", function(req, res) {
  var retrievedFile = require("./"+Object.keys(req.query)[0]);
  console.log("File Retrieved.");
  return res.send(retrievedFile);
});


app.post("/saveJSON", function(req, res) {

  var exportFile = req.body.fileName;
  delete req.body["fileName"];
  const getQuery = JSON.stringify(req.body, null, "\t");
  console.log(getQuery);
  fs.writeFile("public/output/"+exportFile, getQuery, 'utf8', function (err) {
    if (err) throw err;
    console.log('File Uploaded!');
  });

  return res.status(200).end();
});



app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000/');
});
