var express = require('express');
var http = require('http');

var admin = require('./routes/admin.js');


var app = new express();

//使用ejs模板引擎，默认找views这个目录
app.set('view engine', 'ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));
app.use('/upload', express.static('upload'));

var session = require('express-session');
//设置session中间件
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  rolling: true
}));

app.use('/admin', admin);

var server = http.createServer(app);
server.listen(8000, '127.0.0.1');