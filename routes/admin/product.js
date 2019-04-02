var express = require('express');
var router = express.Router();

//匹配admin/product
router.get('/', function(req, res) {
  res.send('product首页');
});

//匹配admin/product/add
router.get('/add', function(req, res) {
  res.send('product add页面');
});

//匹配admin/product/edit
router.get('/edit', function(req, res) {
  res.send('product edit页面');
});

//匹配admin/product/delete
router.get('/delete', function(req, res) {
  res.send('product delete页面');
});

module.exports = router;