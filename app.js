var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var dbURL = "mongodb://127.0.0.1:27017";
var dbName = "productmanagement"

var app = new express();

var server = http.createServer(app);

server.listen(8000, '127.0.0.1');

//设置bodyParser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//使用ejs模板引擎，默认找views这个目录
app.set('view engine', 'ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));

app.get('/login', function(rep, res) {
  res.render('login');
});

app.post('/doLogin', function(rep, res) {
  MongoClient.connect(dbURL, function(err, client) {
    var db = client.db(dbName);
    if(err) {
      console.log('连接数据库失败');
    }

    var result = db.collection("user").find(rep.body);
    result.toArray(function(err, data) {
      if(data.length > 0) {
        console.log('登陆成功');
        res.redirect('/product');
      }else {
        console.log('登陆失败');
        res.send("<script>alert('登陆失败'); window.location.href='/login'</script>");
      }
    });
  });
  console.log(rep.body);  
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

