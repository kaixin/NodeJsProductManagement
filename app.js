var express = require('express');
var http = require('http');

var admin = require('./routes/admin.js');

var app = new express();

app.use('/admin', admin);

var server = http.createServer(app);
server.listen(8000, '127.0.0.1');