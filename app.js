var express = require('express');
var http = require('http');
// var bodyParser = require('body-parser');
var session = require('express-session');
var md5 = require('md5-node');
var db = require('./modules/db.js');
var multiparty = require('multiparty');

var app = new express();

var server = http.createServer(app);

server.listen(8000, '127.0.0.1');

//设置bodyParser中间件
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

//使用ejs模板引擎，默认找views这个目录
app.set('view engine', 'ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));
app.use('/upload', express.static('upload'));

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
// app.use(function(req, res, next) {
//   if(req.url === '/login' || req.url === '/doLogin') {
//     next();
//   }else {
//     if(req.session.userinfo && req.session.userinfo.username !== '') {
//       next();
//     }else {
//       res.redirect('/login');
//     }
//   }
// });

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/doLogin', function(req, res) {
  var username = req.body.username;
  var password = md5(req.body.password);
  db.find('user', {username: username, password: password}, function(data) {
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

app.get('/product', function(req,res) {
  db.find('product', {}, function(data) {
    res.render('index', {
      list: data
    });
  });
});

app.get('/productAdd', function(req,res) {
  res.render('add');
});

app.post('/doProductAdd', function(req, res) {
  var form = new multiparty.Form();
  form.uploadDir = 'upload';
 
  form.parse(req, function(err, fields, files) {
    var title = fields.title[0];
    var price = fields.price[0];
    var fee = fields.fee[0];
    var description = fields.description[0];
    var pic = files.pic[0].path;
    db.insert('product', {
      title: title,
      price: price,
      fee: fee,
      description: description,
      pic: pic
    }, function(data) {
      res.redirect('/product');
    });
  });
});

app.get('/productUpdate', function(req,res) {
  var id = req.query.id;
  db.find('product', {"_id": db.ObjectID(id)}, function(data) {
    res.render('edit', {
      list: data[0]
    });
  });
});

app.post('/doProductUpdate', function(req, res) {
  var form = new multiparty.Form();
  form.uploadDir = 'upload';

  form.parse(req, function(err, fields, files) {
    var id = fields.id[0];
    var title = fields.title[0];
    var price = fields.price[0];
    var fee = fields.fee[0];
    var description = fields.description[0];
    var pic = files.pic[0].path;
    var updateFields;
    if(files.pic[0].originalFilename) {
      updateFields = {
        title: title,
        price: price,
        fee: fee,
        description: description,
        pic: pic
      }
    }else {
      updateFields = {
        title: title,
        price: price,
        fee: fee,
        description: description
      }
    }
    db.update('product', {"_id": db.ObjectID(id)}, updateFields, function(data) {
      res.redirect("/product");
    });
  });
});

app.get('/productDelete', function(req,res) {
  var id = req.query.id;
  db.deleteOne('product', {"_id": db.ObjectID(id)}, function(data) {
    res.redirect('/product');
  });
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

