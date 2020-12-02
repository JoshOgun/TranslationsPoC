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

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000/');
});
