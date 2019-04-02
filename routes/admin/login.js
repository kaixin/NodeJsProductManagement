var express = require('express');
var router = express.Router();

//匹配admin/login
router.get('/', function(req, res) {
  res.send('login首页');
});

//匹配admin/login/doLogin
router.post('/doLogin', function(req, res) {
  res.send('doLogin 页面');
});

module.exports = router;