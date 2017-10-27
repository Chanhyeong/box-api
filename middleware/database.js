var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var mysqlOptions = {
    host:'external.cocotutor.ml',
    port: 3306,
    user: 'coco',
    password: 'whdtjf123@',
    database:'coco'
};

var mongoUrl = 'mongodb://external.cocotutor.ml:27017/chat';

function getMysql () {
    return mysql.createConnection(mysqlOptions).connect(function(err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
            throw err;
        }
    })
}

function MongoDB() {}

// result 값이 router로 전달되지 않아서 callback으로 설계
// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
MongoDB.getMessage = function (mode, id, callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(err, null);

        db.collection(mode).findOne( { _id : id }, function (err, result) {
            assert.equal(err, null);

            callback(result);
        });

        db.close();
    });
};

MongoDB.insertMessage = function (mode, id, message) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert(err, equal);

        db.collection(mode).update( { _id: id }, {
            $push: { log: message }
        });
    });
};

module.exports = function (name) {
    switch (name) {
        case 'mysql': getMysql;
        case 'mongodb': return MongoDB;
    }
};