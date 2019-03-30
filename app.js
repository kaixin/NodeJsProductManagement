var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');

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

//验证登陆
app.use(function(req, res, next) {
  if(req.url === '/login' || req.url === '/doLogin') {
    next();
  }else {
    if(req.session.userinfo && req.session.userinfo.username !== '') {
      next();
    }else {
      res.redirect('/login');
    }
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/doLogin', function(req, res) {
  MongoClient.connect(dbURL, function(err, client) {
    var db = client.db(dbName);
    if(err) {
      console.log('连接数据库失败');
    }

    var result = db.collection("user").find(req.body);
    result.toArray(function(err, data) {
      if(data.length > 0) {
        console.log('登陆成功');

        req.session.userinfo = data[0];
        app.locals['userinfo'] = data[0]; //ejs中设置全局数据，所有页面都可以使用
        
        res.redirect('/product');
      }else {
        console.log('登陆失败');
        res.send("<script>alert('登陆失败'); window.location.href='/login'</script>");
      }
    });
  });
});

app.get('/product', function(req,res) {
  res.render('index');
});

app.get('/productAdd', function(req,res) {
  res.render('add');
});

app.get('/productUpdate', function(req,res) {
  res.render('edit');
});

app.get('/productDelete', function(req,res) {
  res.send('product delete page');
});

app.get('/loginOut', function(req, res) {
  //删除session
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }else {
      res.redirect('/login');
    }
  });
});

