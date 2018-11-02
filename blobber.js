var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var cors = require('cors');

var data = fs.readFileSync('data.json');

var app = express();
app.use(express.static('public'));   //for hosting files.
app.use(cors());

var storedData;

var exists = fs.existsSync('data.json');

if (exists) {

  // Read the file
  console.log('loading data...');
  var txt = fs.readFileSync('data.json', 'utf8');

  // Parse it  back to object
  storedData = JSON.parse(txt);
  
} else {
  // Otherwise start with blank list
  console.log('No data found...');
  storedData = {};
}

//Setting up the server
var server = app.listen(process.env.PORT || 3000, listen);

// This call back tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Testing environment listening at http://' + host + ':' + port);
}

app.get('/store/:content', storeFile);

 
  function storeFile(req, res){
  var content = req.params.content;
 
  // Put it in the object
  storedData[content] = content;

  // Let the request know it's all set
  var reply = {
    status: 'success',
    content: content,
  }

  // Let the request know it's all set
  var reply = {
    status: 'success',
    content: content,
  }

  console.log('adding: ' + JSON.stringify(reply));

  // Write a file each time we get a new word
  var json = JSON.stringify(storedData, null, 2);
  fs.writeFile('data.json', json, 'utf8', finished);

  function finished(err) {
    console.log('Finished writing data.json');
    res.send(reply);
  }
}