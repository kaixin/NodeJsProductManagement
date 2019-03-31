var MongoClient = require('mongodb').MongoClient;
var dbURL = "mongodb://127.0.0.1:27017";
var dbName = "productmanagement";
var ObjectID = require('mongodb').ObjectID;

var __connectDB = function(callback) {
  MongoClient.connect(dbURL, function(err, client) {
    if(err) {
      console.log("数据库连接失败");
      return;
    }
    var db = client.db(dbName);
    callback(db);
  });
}

exports.ObjectID = ObjectID;

//查找数据
exports.find = function(collectionName, json, callback) {
  __connectDB(function(db) {
    var result = db.collection(collectionName).find(json);
    result.toArray(function(err, data) {
      if(err) {
        console.log("获取数据失败");
        return;
      }
      callback(data);
    });
  });
}

//增加数据
exports.insert = function(collectionName, json, callback) {
  __connectDB(function(db) {
    db.collection(collectionName).insertOne(json, function(err, data) {
      if(err) {
        console.log("增加数据失败");
        return;
      }
      callback(data);
    });;
  });
}

//更新数据
exports.update = function(collectionName, json1, json2, callback) {
  __connectDB(function(db) {
    db.collection(collectionName).updateOne(json1, {
      $set: json2
    }, function(err, data) {
      if(err) {
        console.log("更新数据库失败");
        return;
      }
      callback(data);
    });
  });
}

//删除数据
exports.deleteOne = function(collectionName, json, callback) {
  __connectDB(function(db) {
    db.collection(collectionName).deleteOne(json, function(err, data) {
      if(err) {
        console.log("删除数据失败");
        return;
      }
      callback(data);
    });
  });
}
