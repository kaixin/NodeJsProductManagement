var express = require('express');
var http = require('http');

var app = new express();

var server = http.createServer(app);

server.listen(8000, '127.0.0.1');

//使用ejs模板引擎，默认找views这个目录
app.set('view engine', 'ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));

app.get('/login', function(rep, res) {
  res.render('login');
});

app.get('/product', function(rep,res) {
  res.render('index');
});

app.get('/productAdd', function(rep,res) {
  res.render('add');
});

app.get('/productUpdate', function(rep,res) {
  res.render('edit');
});

app.get('/productDelete', function(rep,res) {
  res.send('product delete page');
})

