//setup for local development, opted for running html in the browser as output is raw HTML, CSS, and JS files and not this file :)

var express = require('express');
var app = express();
var path = require('path');

// pages
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pages/costaid', function(req, res) {
    res.sendFile(path.join(__dirname + '/pages/cost-aid.html'));
});

app.get('/', function (req, res) {
    res.sendFile('public/index.js');
});


//serve static files
app.use('/public',express.static(__dirname + '/public'));

//port and server
var PORT = 8080;
console.log("now serving on PORT: ", PORT)

app.listen(PORT);