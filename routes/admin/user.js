var express = require('express');
var router = express.Router();

//匹配admin/user
router.get('/', function(req, res) {
  res.send('用户首页');
});

////匹配admin/user/add
router.get('/add', function(req, res) {
  res.send('用户 add页面');
});

module.exports = router;