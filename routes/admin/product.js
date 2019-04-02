var express = require('express');
var router = express.Router();

var db = require('../../modules/db.js');
var multiparty = require('multiparty');
var fs = require('fs');

//匹配admin/product
router.get('/', function(req, res) {
  db.find('product', {}, function(data) {
    res.render('admin/product/index', {
      list: data
    });
  });
});

//匹配admin/product/add
router.get('/add', function(req, res) {
  res.render('admin/product/add');
});

router.post('/doAdd', function(req, res) {
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
      res.redirect('/admin/product');
    });
  });
});

//匹配admin/product/edit
router.get('/edit', function(req, res) {
  var id = req.query.id;
  db.find('product', {"_id": db.ObjectID(id)}, function(data) {
    res.render('admin/product/edit', {
      list: data[0]
    });
  });
});

router.post('/doEdit', function(req, res) {
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

      fs.unlink(pic, function(err, data) {

      });
    }
    db.update('product', {"_id": db.ObjectID(id)}, updateFields, function(data) {
      res.redirect("/admin/product");
    });
  });
});

//匹配admin/product/delete
router.get('/delete', function(req, res) {
  var id = req.query.id;
  db.deleteOne('product', {"_id": db.ObjectID(id)}, function(data) {
    res.redirect('/admin/product');
  });
});

module.exports = router;