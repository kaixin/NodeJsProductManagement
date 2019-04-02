var express = require('express');
var router = express.Router();

var md5 = require('md5-node');
var bodyParser = require('body-parser');
var db = require('../../modules/db.js');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

//匹配admin/login
router.get('/', function(req, res) {
  res.render('admin/login');
});

//匹配admin/login/doLogin
router.post('/doLogin', function(req, res) {
  var username = req.body.username;
  var password = md5(req.body.password);
  db.find('user', {username: username, password: password}, function(data) {
    if(data.length > 0) {
      console.log('登陆成功');

      req.session.userinfo = data[0];
      // app.locals['userinfo'] = data[0]; //ejs中设置全局数据，所有页面都可以使用
      req.app.locals['userinfo'] = data[0];

      res.redirect('/admin/product');
    }else {
      console.log('登陆失败');
      res.send("<script>alert('登陆失败'); window.location.href='/admin/login'</script>");
    }
  });
});

router.get('/loginOut', function(req, res) {
  //删除session
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }else {
      res.redirect('/admin/login');
    }
  });
});

module.exports = router;